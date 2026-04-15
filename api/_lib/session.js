import crypto from "node:crypto";

const SESSION_COOKIE_NAME = "salon_tugba_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

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

export function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${secure}`
  );
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
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
