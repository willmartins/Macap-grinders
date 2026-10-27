import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function memoryLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

let upstash: Ratelimit | null | undefined;

function sharedLimiter(): Ratelimit | null {
  if (upstash !== undefined) return upstash;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    upstash = null;
    return null;
  }
  upstash = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
    prefix: "macap:contact",
    analytics: false,
  });
  return upstash;
}

/** Five messages in ten minutes. Uses Upstash when configured, otherwise this server's memory. */
export async function allowContact(key: string): Promise<boolean> {
  const limiter = sharedLimiter();
  if (!limiter) return memoryLimit(key);
  try {
    const result = await limiter.limit(key);
    return result.success;
  } catch (error) {
    console.error("Contact rate limit failed, using memory.", error);
    return memoryLimit(key);
  }
}
