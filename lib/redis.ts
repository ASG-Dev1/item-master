import Redis from "ioredis";

declare global {
  // Persist the client across Next.js hot-reloads in development
  var __redis: Redis | undefined;
}

function createClient(): Redis {
  const url = process.env.REDIS_URL;

  let client: Redis;

  if (url) {
    client = new Redis(url, {
      // ioredis infers TLS from the rediss:// scheme automatically.
      // Do NOT pass a redundant tls:{} option — on some Node versions it
      // conflicts with the URL's built-in TLS and causes ECONNRESET.
      maxRetriesPerRequest: 3,
      enableReadyCheck: false, // avoids a blocking PING on startup
      lazyConnect: true,       // don't connect until the first command
    });
  } else {
    client = new Redis({
      host: process.env.REDIS_HOST ?? "localhost",
      port: Number(process.env.REDIS_PORT ?? 6379),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_HOST ? {} : undefined,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    });
  }

  // Without this handler Node.js throws an uncaught error and crashes the
  // process whenever ioredis loses/fails the connection.
  client.on("error", (err: Error) => {
    console.error("[Redis] connection error:", err.message);
  });

  return client;
}

const redis = globalThis.__redis ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__redis = redis;
}

export default redis;
