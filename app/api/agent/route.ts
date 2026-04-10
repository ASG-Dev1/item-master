import { NextRequest, NextResponse } from "next/server";
import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";
import { randomUUID } from "crypto";
import {
  createJob,
  completeJob,
  failJob,
  waitForJob,
  INSTANT_TIMEOUT_MS,
  type NigpResult,
} from "@/lib/agent-queue";

const projectEndpoint =
  process.env.AZURE_EXISTING_AIPROJECT_ENDPOINT ??
  "https://item-master-foundry.services.ai.azure.com/api/projects/Item-Master";

// AZURE_EXISTING_AGENT_ID format: "AGENT_NAME:VERSION"
const [agentName, agentVersion] = (
  process.env.AZURE_EXISTING_AGENT_ID ?? "NIGP-JEDI2:5"
).split(":");

type Mode = "instant" | "queue";

/**
 * Calls Azure AI Foundry, parses the NIGP JSON result, then persists it.
 * Runs in the background — never throws to the caller.
 */
async function runAgentJob(jobId: string, message: string): Promise<void> {
  try {
    const projectClient = new AIProjectClient(
      projectEndpoint,
      new DefaultAzureCredential()
    );

    const openAIClient = projectClient.getOpenAIClient();

    const conversation = await openAIClient.conversations.create({
      items: [{ type: "message", role: "user", content: message }],
    });

    const response = await openAIClient.responses.create(
      { conversation: conversation.id },
      {
        body: {
          agent: {
            name: agentName,
            version: agentVersion,
            type: "agent_reference",
          },
        },
      }
    );

    const result: NigpResult = JSON.parse(response.output_text ?? "{}");
    await completeJob(jobId, result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Azure AI error";
    console.error(`[agent-job:${jobId}] failed:`, err);
    await failJob(jobId, message);
  }
}

export async function POST(req: NextRequest) {
  // --- Parse & validate request body ---
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

  // Persist the job and start processing in the background
  await createJob(jobId, trimmedMessage);
  void runAgentJob(jobId, trimmedMessage);

  // --- queue mode: return jobId immediately ---
  if (mode === "queue") {
    return NextResponse.json({ jobId, status: "pending" }, { status: 202 });
  }

  // --- instant mode: wait up to INSTANT_TIMEOUT_MS for a result ---
  const completedJob = await waitForJob(jobId, INSTANT_TIMEOUT_MS);

  if (!completedJob) {
    // Timed out — job is still running, hand back the jobId for polling
    return NextResponse.json({ jobId, status: "pending" }, { status: 202 });
  }

  if (completedJob.status === "error") {
    return NextResponse.json(
      { error: completedJob.error ?? "Agent job failed" },
      { status: 502 }
    );
  }

  // Success — return the NIGP result directly (preserves original response format)
  return NextResponse.json(completedJob.result);
}
