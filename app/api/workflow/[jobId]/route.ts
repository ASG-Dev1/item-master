import { NextRequest, NextResponse } from "next/server";
import { getWorkflowJob } from "@/lib/agent-queue";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  const job = await getWorkflowJob(jobId);

  if (!job) {
    return NextResponse.json(
      { error: "Job not found. It may have expired or never existed." },
      { status: 404 }
    );
  }

  if (job.status === "pending") {
    return NextResponse.json({ jobId, status: "pending" }, { status: 202 });
  }

  if (job.status === "error") {
    return NextResponse.json(
      { jobId, status: "error", error: job.error },
      { status: 502 }
    );
  }

  return NextResponse.json(job.result);
}
