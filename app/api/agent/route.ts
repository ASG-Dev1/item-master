import { NextRequest, NextResponse } from "next/server";
import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

const projectEndpoint =
  process.env.AZURE_EXISTING_AIPROJECT_ENDPOINT ??
  "https://item-master-foundry.services.ai.azure.com/api/projects/Item-Master";

// AZURE_EXISTING_AGENT_ID format: "AGENT_NAME:VERSION"
const [agentName, agentVersion] = (
  process.env.AZURE_EXISTING_AGENT_ID ?? "NIGP-JEDI2:5"
).split(":");

export async function POST(req: NextRequest) {
  let message: string;

  try {
    const body = await req.json();
    message = body?.message;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!message || typeof message !== "string" || message.trim() === "") {
    return NextResponse.json(
      { error: "Missing required field: message (non-empty string)" },
      { status: 400 }
    );
  }

  try {
    const projectClient = new AIProjectClient(
      projectEndpoint,
      new DefaultAzureCredential()
    );

    const openAIClient = projectClient.getOpenAIClient();

    const conversation = await openAIClient.conversations.create({
      items: [{ type: "message", role: "user", content: message.trim() }],
    });

    const response = await openAIClient.responses.create(
      { conversation: conversation.id },
      {
        body: {
          agent: { name: agentName, version: agentVersion, type: "agent_reference" },
        },
      }
    );

    let output: unknown;
    try {
      output = JSON.parse(response.output_text ?? "");
    } catch {
      output = response.output_text;
    }

    return NextResponse.json(output);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error contacting Azure AI";
    console.error("[/api/agent] Azure AI error:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
