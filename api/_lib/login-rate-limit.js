const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 10 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const FALLBACK_CLIENT_KEY = "unknown-client";
const STORE_KEY = "__salonTugbaAdminLoginRateLimitStore";

function getStore() {
  if (!globalThis[STORE_KEY]) {
    globalThis[STORE_KEY] = new Map();
  }

  return globalThis[STORE_KEY];
}

function normalizeIp(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getClientKey(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const remoteAddress = req.socket?.remoteAddress;

  const firstForwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : String(forwardedFor ?? "")
        .split(",")
        .map((part) => part.trim())
        .find(Boolean);

  const normalizedIp = normalizeIp(firstForwardedIp || realIp || remoteAddress);
  return normalizedIp || FALLBACK_CLIENT_KEY;
}

function cleanupExpiredEntries(store, now) {
  for (const [key, entry] of store.entries()) {
    const isWindowExpired =
      entry.lastFailedAt && now - entry.lastFailedAt > ATTEMPT_WINDOW_MS;
    const isBlockExpired = !entry.blockedUntil || entry.blockedUntil <= now;

    if (isWindowExpired && isBlockExpired) {
      store.delete(key);
    }
  }
}

export function getLoginRateLimitState(req) {
  const now = Date.now();
  const store = getStore();
  cleanupExpiredEntries(store, now);

  const key = getClientKey(req);
  const entry = store.get(key);

  if (!entry) {
    return {
      key,
      blocked: false,
      retryAfterSeconds: 0,
      remainingAttempts: MAX_FAILED_ATTEMPTS,
    };
  }

  if (entry.blockedUntil && entry.blockedUntil > now) {
    return {
      key,
      blocked: true,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((entry.blockedUntil - now) / 1000)
      ),
      remainingAttempts: 0,
    };
  }

  if (entry.lastFailedAt && now - entry.lastFailedAt > ATTEMPT_WINDOW_MS) {
    store.delete(key);
    return {
      key,
      blocked: false,
      retryAfterSeconds: 0,
      remainingAttempts: MAX_FAILED_ATTEMPTS,
    };
  }

  return {
    key,
    blocked: false,
    retryAfterSeconds: 0,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - entry.count),
  };
}

export function registerFailedLogin(req) {
  const now = Date.now();
  const store = getStore();
  const key = getClientKey(req);
  const currentEntry = store.get(key);

  if (!currentEntry || now - currentEntry.lastFailedAt > ATTEMPT_WINDOW_MS) {
    const nextCount = 1;

    store.set(key, {
      count: nextCount,
      lastFailedAt: now,
      blockedUntil: null,
    });

    return {
      key,
      blocked: false,
      retryAfterSeconds: 0,
      remainingAttempts: MAX_FAILED_ATTEMPTS - nextCount,
    };
  }

  const nextCount = currentEntry.count + 1;
  const blockedUntil =
    nextCount >= MAX_FAILED_ATTEMPTS ? now + BLOCK_DURATION_MS : null;

  store.set(key, {
    count: nextCount,
    lastFailedAt: now,
    blockedUntil,
  });

  return {
    key,
    blocked: Boolean(blockedUntil),
    retryAfterSeconds: blockedUntil
      ? Math.max(1, Math.ceil((blockedUntil - now) / 1000))
      : 0,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - nextCount),
  };
}

export function clearFailedLoginAttempts(req) {
  const store = getStore();
  const key = getClientKey(req);
  store.delete(key);
}
