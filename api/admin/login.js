import {
  createSessionToken,
  setSessionCookie,
  verifyCredentials,
} from "../_lib/session.js";

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

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  return Promise.resolve(readJsonBody(req))
    .then(({ username, password } = {}) => {
      if (!verifyCredentials(username, password)) {
        return res
          .status(401)
          .json({ message: "Kullanıcı adı veya şifre hatalı." });
      }

      const token = createSessionToken(username);
      setSessionCookie(res, token);

      return res.status(200).json({
        authenticated: true,
        user: { username },
      });
    })
    .catch((error) => {
      console.error("Admin login error:", error);
      return res
        .status(500)
        .json({ message: "Admin girişi şu anda kullanılamıyor." });
    });
}
