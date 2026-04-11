/**
 * In-memory rate limiter (per server instance).
 * For multi-instance production, replace with Redis/Upstash.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const prev = buckets.get(key) ?? [];
  const kept = prev.filter((t) => t > windowStart);
  if (kept.length >= max) {
    buckets.set(key, kept);
    return false;
  }
  kept.push(now);
  buckets.set(key, kept);
  return true;
}
