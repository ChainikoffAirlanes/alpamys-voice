import { createHash } from "node:crypto";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;
const buckets = new Map<string, number[]>();

export function getClientIp(headers: Headers) {
  return headers.get("x-real-ip")?.trim() || headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function checkRateLimit(ip: string, now = Date.now()) {
  const key = createHash("sha256").update(ip).digest("hex");
  const cutoff = now - WINDOW_MS;
  const recent = (buckets.get(key) ?? []).filter((timestamp) => timestamp > cutoff);
  if (recent.length >= MAX_REQUESTS) {
    buckets.set(key, recent);
    return { allowed: false, retryAfterSeconds: Math.ceil((recent[0] + WINDOW_MS - now) / 1000) };
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [bucketKey, entries] of buckets) if (entries.every((timestamp) => timestamp <= cutoff)) buckets.delete(bucketKey);
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
