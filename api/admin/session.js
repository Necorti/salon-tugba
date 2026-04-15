import { readSessionFromRequest } from "../_lib/session.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const session = readSessionFromRequest(req);

    if (!session) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        username: session.username,
      },
    });
  } catch (error) {
    console.error("Admin session error:", error);
    return res.status(500).json({ authenticated: false });
  }
}
