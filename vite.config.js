import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import loginHandler from "./api/admin/login.js";
import logoutHandler from "./api/admin/logout.js";
import saveContentHandler from "./api/admin/save-content.js";
import sessionHandler from "./api/admin/session.js";

function createVercelStyleResponse(nodeRes) {
  return {
    get headersSent() {
      return nodeRes.headersSent;
    },
    setHeader(name, value) {
      nodeRes.setHeader(name, value);
      return this;
    },
    status(code) {
      nodeRes.statusCode = code;
      return this;
    },
    json(payload) {
      if (!nodeRes.headersSent) {
        nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
      }

      nodeRes.end(JSON.stringify(payload));
      return this;
    },
    send(payload) {
      if (typeof payload === "object" && payload !== null) {
        return this.json(payload);
      }

      nodeRes.end(String(payload ?? ""));
      return this;
    },
    end(payload) {
      nodeRes.end(payload);
      return this;
    },
  };
}

function devAdminApiPlugin() {
  const routeHandlers = new Map([
    ["/api/admin/login", loginHandler],
    ["/api/admin/logout", logoutHandler],
    ["/api/admin/save-content", saveContentHandler],
    ["/api/admin/session", sessionHandler],
  ]);

  return {
    name: "dev-admin-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = req.url ? new URL(req.url, "http://localhost") : null;
        const pathname = requestUrl?.pathname;
        const handler = pathname ? routeHandlers.get(pathname) : null;

        if (!handler) {
          next();
          return;
        }

        try {
          const adaptedResponse = createVercelStyleResponse(res);
          await handler(req, adaptedResponse);
        } catch (error) {
          console.error("[vite-dev-admin-api] handler failed:", error);

          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({ message: "Local admin API request failed." })
            );
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), devAdminApiPlugin()],
  };
});
