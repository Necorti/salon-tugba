import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function normalizePrivateKey(rawPrivateKey) {
  if (typeof rawPrivateKey !== "string") {
    return "";
  }

  const trimmedKey = rawPrivateKey.trim();
  const unquotedKey = trimmedKey
    .replace(/^"(.*)"$/s, "$1")
    .replace(/^'(.*)'$/s, "$1")
    .trim();
  const normalizedKey = unquotedKey
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!normalizedKey.includes("BEGIN PRIVATE KEY")) {
    return "";
  }

  return normalizedKey;
}

function logFirebaseAdmin(level, message, details) {
  const logger = console[level] ?? console.warn;

  if (details) {
    logger(`[firebase-admin] ${message}`, details);
    return;
  }

  logger(`[firebase-admin] ${message}`);
}

function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!privateKey) {
    logFirebaseAdmin("warn", "invalid private key format", {
      hasRawPrivateKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
    });
    return null;
  }

  if (!projectId || !clientEmail) {
    logFirebaseAdmin(
      "warn",
      "missing Firebase Admin credentials. Admin SDK disabled.",
      {
        hasProjectId: Boolean(projectId),
        hasClientEmail: Boolean(clientEmail),
      }
    );
    return null;
  }

  if (
    !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
    !privateKey.includes("-----END PRIVATE KEY-----")
  ) {
    logFirebaseAdmin("warn", "invalid private key format");
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const adminConfig = getFirebaseAdminConfig();

  if (!adminConfig) {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId: adminConfig.projectId,
      clientEmail: adminConfig.clientEmail,
      privateKey: adminConfig.privateKey,
    }),
  });
}

export function getAdminFirestore() {
  const adminApp = getAdminApp();

  if (!adminApp) {
    return null;
  }

  return getFirestore(adminApp);
}
