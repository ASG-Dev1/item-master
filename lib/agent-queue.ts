import redis from "./redis";

// TTL for job results stored in Redis (1 hour)
const JOB_TTL_SECONDS = 60 * 60;

// How long (ms) the instant mode waits before falling back to polling
export const INSTANT_TIMEOUT_MS = 25_000;

export type JobStatus = "pending" | "done" | "error";

export interface NigpResult {
  nigp_category_code: string;
  nigp_category_description: string;
  nigp_subcategory_code: string;
  nigp_subcategory_description: string;
}

export interface AgentJob {
  jobId: string;
  status: JobStatus;
  message: string;
  createdAt: string;
  completedAt?: string;
  result?: NigpResult;
  error?: string;
}

function jobKey(jobId: string): string {
  return `agent:job:${jobId}`;
}

export async function createJob(jobId: string, message: string): Promise<void> {
  const job: AgentJob = {
    jobId,
    status: "pending",
    message,
    createdAt: new Date().toISOString(),
  };
  await redis.set(jobKey(jobId), JSON.stringify(job), "EX", JOB_TTL_SECONDS);
}

export async function completeJob(
  jobId: string,
  result: NigpResult
): Promise<void> {
  const raw = await redis.get(jobKey(jobId));
  const job: AgentJob = raw ? JSON.parse(raw) : { jobId };
  const updated: AgentJob = {
    ...job,
    status: "done",
    result,
    completedAt: new Date().toISOString(),
  };
  await redis.set(jobKey(jobId), JSON.stringify(updated), "EX", JOB_TTL_SECONDS);
}

export async function failJob(jobId: string, error: string): Promise<void> {
  const raw = await redis.get(jobKey(jobId));
  const job: AgentJob = raw ? JSON.parse(raw) : { jobId };
  const updated: AgentJob = {
    ...job,
    status: "error",
    error,
    completedAt: new Date().toISOString(),
  };
  await redis.set(jobKey(jobId), JSON.stringify(updated), "EX", JOB_TTL_SECONDS);
}

export async function getJob(jobId: string): Promise<AgentJob | null> {
  const raw = await redis.get(jobKey(jobId));
  return raw ? (JSON.parse(raw) as AgentJob) : null;
}

/**
 * Waits up to `timeoutMs` for a job to reach "done" or "error".
 * Polls Redis every 500ms.
 * Returns the completed job, or null if timeout is reached first.
 */
export async function waitForJob(
  jobId: string,
  timeoutMs: number
): Promise<AgentJob | null> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const job = await getJob(jobId);
    if (job && (job.status === "done" || job.status === "error")) {
      return job;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return null;
}
