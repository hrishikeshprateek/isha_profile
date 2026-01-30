// Simple in-memory rate limiter
// Not suitable for multi-instance production; use Redis or a central store for production.

type Entry = {
  count: number;
  start: number; // ms timestamp
};

const store = new Map<string, Entry>();

export function getClientIp(request: any): string {
  try {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    const xrip = request.headers.get('x-real-ip');
    if (xrip) return xrip;
  } catch (e) {
    // ignore
  }
  return '127.0.0.1';
}

export function checkRateLimit(key: string, ip: string, limit = 60, windowSeconds = 3600) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const storeKey = `${key}:${ip}`;
  const existing = store.get(storeKey);

  if (!existing || now - existing.start > windowMs) {
    // reset window
    store.set(storeKey, { count: 1, start: now });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (existing.count + 1 > limit) {
    const resetAt = existing.start + windowMs;
    return { allowed: false, remaining: 0, reset: resetAt };
  }

  existing.count += 1;
  store.set(storeKey, existing);
  return { allowed: true, remaining: Math.max(0, limit - existing.count), reset: existing.start + windowMs };
}

// Optional cleanup to prevent memory growth. Run every so often.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) {
    // If entry older than 2x largest window (safety), delete
    if (now - v.start > 2 * 3600 * 1000) store.delete(k);
  }
}, 1000 * 60 * 10);

