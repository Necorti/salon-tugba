import { getAdminFirestore } from "../_lib/firebase-admin.js";
import { readSessionFromRequest } from "../_lib/session.js";

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const session = readSessionFromRequest(req);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { payload: rawPayload } = await readJsonBody(req);

    if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
      return res.status(400).json({ message: "Invalid site content payload." });
    }

    const payload = rawPayload;
    const firestore = getAdminFirestore();

    if (!firestore) {
      console.warn(
        "[admin-save-content] Firebase Admin not initialized. Save skipped."
      );
      return res.status(503).json({ message: "Firebase Admin not initialized" });
    }

    await firestore.collection("site").doc("main").set(payload, { merge: true });

    return res.status(200).json({ ok: true, payload });
  } catch (error) {
    const errorContext = {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === "object" && "code" in error ? error.code : undefined,
      hasFirebaseProjectId: Boolean(process.env.FIREBASE_PROJECT_ID?.trim()),
      hasFirebaseClientEmail: Boolean(process.env.FIREBASE_CLIENT_EMAIL?.trim()),
      hasFirebasePrivateKey: Boolean(process.env.FIREBASE_PRIVATE_KEY?.trim()),
    };

    console.error("Admin save content error:", errorContext);

    return res
      .status(500)
      .json({ message: "Icerik kaydi su anda tamamlanamadi." });
  }
}
