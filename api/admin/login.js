import {
  createSessionToken,
  setSessionCookie,
  verifyCredentials,
} from "../_lib/session.js";
import {
  clearFailedLoginAttempts,
  getLoginRateLimitState,
  registerFailedLogin,
} from "../_lib/login-rate-limit.js";

const RATE_LIMIT_MESSAGE =
  "Çok fazla başarısız giriş denemesi. Lütfen biraz sonra tekrar deneyin.";

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

  const rateLimitState = getLoginRateLimitState(req);

  if (rateLimitState.blocked) {
    res.setHeader("Retry-After", String(rateLimitState.retryAfterSeconds));
    return res.status(429).json({ message: RATE_LIMIT_MESSAGE });
  }

  return Promise.resolve(readJsonBody(req))
    .then(({ username, password } = {}) => {
      if (!verifyCredentials(username, password)) {
        const failedAttempt = registerFailedLogin(req);

        if (failedAttempt.blocked) {
          res.setHeader("Retry-After", String(failedAttempt.retryAfterSeconds));
          return res.status(429).json({ message: RATE_LIMIT_MESSAGE });
        }

        return res
          .status(401)
          .json({ message: "Kullanıcı adı veya şifre hatalı." });
      }

      clearFailedLoginAttempts(req);
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
