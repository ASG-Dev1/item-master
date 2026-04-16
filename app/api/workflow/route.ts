import { NextRequest, NextResponse } from "next/server";
import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";
import { randomUUID } from "crypto";
import {
  createWorkflowJob,
  completeWorkflowJob,
  failWorkflowJob,
  waitForWorkflowJob,
  parseWorkflowOutput,
  INSTANT_TIMEOUT_MS,
  type WorkflowResult,
} from "@/lib/agent-queue";

const projectEndpoint =
  process.env.AZURE_EXISTING_AIPROJECT_ENDPOINT ??
  "https://item-master-foundry.services.ai.azure.com/api/projects/Item-Master";

const agentName = process.env.AZURE_WORKFLOW_AGENT_NAME ?? "Test1";

// The Test1 workflow pipeline takes ~90-120 s — give it 3 minutes max
const WORKFLOW_POLL_INTERVAL_MS = 5_000;
const WORKFLOW_MAX_POLL_MS = 180_000;

type Mode = "instant" | "queue";

/**
 * Calls the Test1 workflow agent using background mode, polls for completion,
 * parses the multi-step JSON output, and persists the result.
 * Runs in the background — never throws to the caller.
 */
async function runWorkflowJob(jobId: string, message: string): Promise<void> {
  try {
    const projectClient = new AIProjectClient(
      projectEndpoint,
      new DefaultAzureCredential()
    );

    const openAIClient = projectClient.getOpenAIClient();

    // 1. Create conversation with the user message.
    const conversation = await openAIClient.conversations.create({
      items: [{ type: "message", role: "user", content: message }],
    });

    // 2. Start the response in background mode.
    //    The Test1 workflow agent auto-triggers AND conflicts with a
    //    synchronous responses.create; background=true avoids that race.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backgroundResponse = await (openAIClient.responses.create as any)(
      {
        conversation: conversation.id,
        background: true,
      },
      {
        body: {
          agent: { name: agentName, type: "agent_reference" },
        },
      }
    );

    const responseId: string = backgroundResponse.id;
    if (!responseId) {
      throw new Error("No response ID returned from background responses.create");
    }

    // 3. Poll until status is "completed" or "failed"
    const deadline = Date.now() + WORKFLOW_MAX_POLL_MS;
    let outputText = "";

    while (Date.now() < deadline) {
      await new Promise((res) => setTimeout(res, WORKFLOW_POLL_INTERVAL_MS));

      const polled = await openAIClient.responses.retrieve(responseId);

      if (polled.status === "completed") {
        outputText = polled.output_text ?? "";
        break;
      }

      if (polled.status === "failed" || polled.status === "cancelled") {
        const detail =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (polled as any).error?.message ?? `Workflow ${polled.status}`;
        throw new Error(detail);
      }

      // "in_progress" — keep polling; output_text may contain partial output
    }

    if (!outputText) {
      throw new Error(
        "Workflow timed out — no completed response within 3 minutes"
      );
    }

    const result: WorkflowResult = parseWorkflowOutput(outputText);
    await completeWorkflowJob(jobId, result);
  } catch (err) {
    const errMsg =
      err instanceof Error ? err.message : "Unknown Azure AI error";
    console.error(`[workflow-job:${jobId}] failed:`, err);
    await failWorkflowJob(jobId, errMsg);
  }
}

export async function POST(req: NextRequest) {
  let message: string;
  let mode: Mode = "instant";

  try {
    const body = await req.json();
    message = body?.message;
    if (body?.mode === "queue" || body?.mode === "instant") {
      mode = body.mode;
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!message || typeof message !== "string" || message.trim() === "") {
    return NextResponse.json(
      { error: "Missing required field: message (non-empty string)" },
      { status: 400 }
    );
  }

  const trimmedMessage = message.trim();
  const jobId = randomUUID();

  await createWorkflowJob(jobId, trimmedMessage);
  void runWorkflowJob(jobId, trimmedMessage);

  if (mode === "queue") {
    return NextResponse.json({ jobId, status: "pending" }, { status: 202 });
  }

  // Instant mode: wait INSTANT_TIMEOUT_MS (25 s) — workflow usually takes
  // 90-120 s, so this will typically fall back to polling.
  const completedJob = await waitForWorkflowJob(jobId, INSTANT_TIMEOUT_MS);

  if (!completedJob) {
    return NextResponse.json({ jobId, status: "pending" }, { status: 202 });
  }

  if (completedJob.status === "error") {
    return NextResponse.json(
      { error: completedJob.error ?? "Workflow job failed" },
      { status: 502 }
    );
  }

  return NextResponse.json(completedJob.result);
}
