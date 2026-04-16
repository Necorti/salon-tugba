import crypto from "node:crypto";

const SESSION_COOKIE_NAME = "salon_tugba_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 2;

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function buildCookieAttributes(maxAgeSeconds) {
  const expiresAt =
    maxAgeSeconds > 0
      ? new Date(Date.now() + maxAgeSeconds * 1000)
      : new Date(0);
  const attributes = [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    `Expires=${expiresAt.toUTCString()}`,
  ];

  if (isProduction()) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function encode(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

export function createSessionToken(username) {
  const payload = {
    username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const encodedPayload = encode(payload);
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature || "");
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    !signature ||
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = decode(encodedPayload);

    if (!payload?.username || !payload?.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionStateFromToken(token) {
  if (!token || !token.includes(".")) {
    return { status: "missing", session: null };
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature || "");
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    !signature ||
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return { status: "invalid", session: null };
  }

  try {
    const payload = decode(encodedPayload);

    if (!payload?.username || !payload?.exp) {
      return { status: "invalid", session: null };
    }

    if (payload.exp < Date.now()) {
      return { status: "expired", session: null };
    }

    return { status: "authenticated", session: payload };
  } catch {
    return { status: "invalid", session: null };
  }
}

export function readSessionFromRequest(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookieValue = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!cookieValue) {
    return null;
  }

  const [, token = ""] = cookieValue.split("=");
  return verifySessionToken(token);
}

export function getSessionStateFromRequest(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookieValue = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!cookieValue) {
    return { status: "missing", session: null };
  }

  const [, token = ""] = cookieValue.split("=");
  return getSessionStateFromToken(token);
}

export function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${token}; ${buildCookieAttributes(SESSION_MAX_AGE)}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; ${buildCookieAttributes(0)}`
  );
}

export function verifyCredentials(username, password) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    throw new Error("Admin credentials are not configured.");
  }

  const normalizedUsername = String(username ?? "");
  const normalizedPassword = String(password ?? "");
  const usernameBuffer = Buffer.from(normalizedUsername);
  const expectedUsernameBuffer = Buffer.from(expectedUsername);
  const passwordBuffer = Buffer.from(normalizedPassword);
  const expectedPasswordBuffer = Buffer.from(expectedPassword);

  return (
    usernameBuffer.length === expectedUsernameBuffer.length &&
    passwordBuffer.length === expectedPasswordBuffer.length &&
    crypto.timingSafeEqual(usernameBuffer, expectedUsernameBuffer) &&
    crypto.timingSafeEqual(passwordBuffer, expectedPasswordBuffer)
  );
}
