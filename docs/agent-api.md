# NIGP Agent API

Classifies item descriptions into NIGP category and subcategory codes using the **NIGP-JEDI2** Azure AI Foundry agent.

---

## Endpoints

### `POST /api/agent`

Submits an item description for classification.

#### Request

```http
POST /api/agent
Content-Type: application/json
```

```json
{
  "message": "Laptop computer",
  "mode": "instant"
}
```

| Field     | Type                       | Required | Default     | Description |
|-----------|----------------------------|----------|-------------|-------------|
| `message` | `string`                   | Yes      | —           | Item description to classify |
| `mode`    | `"instant"` \| `"queue"`   | No       | `"instant"` | Response strategy (see below) |

---

#### Modes

| Mode       | Behaviour |
|------------|-----------|
| `instant`  | Waits up to **25 seconds** for the Azure AI response. Returns the result directly if it arrives in time. Falls back to returning a `jobId` with `status: "pending"` if it times out — the job keeps running in the background. |
| `queue`    | Returns a `jobId` immediately (`202 Accepted`). The job runs in the background. Poll `GET /api/agent/[jobId]` for the result. |

---

#### Responses

**200 — Result returned immediately** (`instant` mode, response arrived in time)

```json
{
  "nigp_category_code": "204",
  "nigp_category_description": "COMPUTER HARDWARE AND PERIPHERALS FOR MICROCOMPUTERS",
  "nigp_subcategory_code": "54",
  "nigp_subcategory_description": "Microcomputers, Handheld, Laptop, and Notebook"
}
```

**202 — Job accepted, poll for result** (`queue` mode, or `instant` timed out)

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

**400 — Bad request**

```json
{ "error": "Missing required field: message (non-empty string)" }
```

**502 — Azure AI error**

```json
{ "error": "..." }
```

---

### `GET /api/agent/[jobId]`

Polls the status and result of a queued job.

#### Request

```http
GET /api/agent/550e8400-e29b-41d4-a716-446655440000
```

#### Responses

**202 — Still processing**

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

**200 — Complete**

```json
{
  "nigp_category_code": "204",
  "nigp_category_description": "COMPUTER HARDWARE AND PERIPHERALS FOR MICROCOMPUTERS",
  "nigp_subcategory_code": "54",
  "nigp_subcategory_description": "Microcomputers, Handheld, Laptop, and Notebook"
}
```

**502 — Agent failed**

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "error",
  "error": "..."
}
```

**404 — Job not found or expired**

```json
{ "error": "Job not found. It may have expired or never existed." }
```

> Jobs expire from Redis after **1 hour**.

---

## curl Examples

### Instant (default)

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Laptop computer"}'
```

### Queue mode

```bash
# Step 1 — submit job
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Laptop computer", "mode": "queue"}'

# Step 2 — poll until done (replace JOB_ID)
curl http://localhost:3000/api/agent/JOB_ID
```

### Production

```bash
curl -X POST https://asg-webapp-dev-item-eybwe0bzenc8bxew.eastus2-01.azurewebsites.net/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Laptop computer"}'
```

---

## Polling Strategy (client-side)

For `queue` mode or when `instant` times out, poll with exponential backoff:

```typescript
async function pollJob(jobId: string, baseUrl: string) {
  const delays = [2000, 3000, 5000, 8000, 10000]; // ms
  for (const delay of delays) {
    await new Promise((r) => setTimeout(r, delay));
    const res = await fetch(`${baseUrl}/api/agent/${jobId}`);
    if (res.status === 200) return res.json();       // done
    if (res.status === 502) throw new Error("Agent job failed");
    // 202 = still pending, keep polling
  }
  throw new Error("Job timed out after polling");
}
```

---

## Environment Variables

| Variable                           | Description |
|------------------------------------|-------------|
| `AZURE_EXISTING_AIPROJECT_ENDPOINT`| Azure AI Foundry project endpoint URL |
| `AZURE_EXISTING_AGENT_ID`          | Agent reference in `NAME:VERSION` format (e.g. `NIGP-JEDI2:5`) |
| `REDIS_URL`                        | Full Redis/Valkey connection URL (`rediss://...` for TLS) |
| `REDIS_HOST`                       | Redis host (used if `REDIS_URL` is not set) |
| `REDIS_PORT`                       | Redis port (default: `6379`) |
| `REDIS_USERNAME`                   | Redis username |
| `REDIS_PASSWORD`                   | Redis password |

---

## Architecture

```
Client
  │
  ├─ POST /api/agent { message, mode }
  │     │
  │     ├─ createJob(jobId) → Redis
  │     ├─ runAgentJob(jobId) → background (non-blocking)
  │     │
  │     ├─ mode=instant → waitForJob(25s)
  │     │     ✓ done in time  → return NIGP result (200)
  │     │     ✗ timeout       → return { jobId } (202)
  │     │
  │     └─ mode=queue  → return { jobId } (202)
  │
  └─ GET /api/agent/[jobId]
        └─ getJob(jobId) → Redis
              pending → 202
              done    → NIGP result (200)
              error   → 502

Background (same process):
  runAgentJob → Azure AI Foundry → completeJob / failJob → Redis
```

> **Azure App Service note:** The background job runs within the same Node.js process. It survives as long as the App Service instance is alive (no instance restarts mid-job). Job state is always persisted in Redis, so any instance can serve the polling response.
