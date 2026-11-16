const buckets = new Map();
const inFlight = new Set();
const MAX_ENTRIES = 5000;

function cleanup(now) {
  if (buckets.size < MAX_ENTRIES) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

// 进程内固定窗口计数。多实例部署时各实例独立计数，作为低成本的防刷第一层。
export function hit(scope, identity, limit, windowMs) {
  const now = Date.now();
  const key = `${scope}:${identity}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    buckets.set(key, next);
    cleanup(now);
    return { allowed: true, remaining: limit - 1, resetAt: next.resetAt };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function acquire(identity) {
  if (inFlight.has(identity)) return false;
  inFlight.add(identity);
  return true;
}

export function release(identity) {
  inFlight.delete(identity);
}

export function tooMany(message, resetAt) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return Response.json(
    { error: message, retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
