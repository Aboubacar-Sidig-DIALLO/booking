import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : undefined;

export const rateLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m") })
  : undefined;

export async function ratelimitCheck(key: string) {
  if (!rateLimiter) return { success: true } as const;
  try {
    const r = await rateLimiter.limit(key);
    return {
      success: r.success,
      remaining: r.remaining,
      reset: r.reset,
    } as const;
  } catch {
    return { success: true } as const;
  }
}

export async function publish(channel: string, message: unknown) {
  if (!redis) return;
  try {
    await redis.publish(channel, JSON.stringify(message));
  } catch {}
}
