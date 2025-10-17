type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 10, intervalMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: limit, updatedAt: now };
  const elapsed = now - b.updatedAt;
  const refill = Math.floor(elapsed / intervalMs) * limit;
  b.tokens = Math.min(limit, b.tokens + refill);
  b.updatedAt = now;
  if (b.tokens <= 0) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}
