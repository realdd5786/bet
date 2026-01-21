type RateEntry = { count: number; lastRequest: number };

const store = new Map<string, RateEntry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, lastRequest: now });
    return { ok: true, remaining: limit - 1 };
  }

  if (now - entry.lastRequest > windowMs) {
    store.set(key, { count: 1, lastRequest: now });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  store.set(key, entry);
  return { ok: true, remaining: limit - entry.count };
}
