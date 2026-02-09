import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import axios from "axios";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

const FLASK_PORT = parseInt(process.env.FLASK_PORT || "5000");
const FLASK_BASE = `http://localhost:${FLASK_PORT}`;

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Proxy Flask API routes: /api/reservations/*, /api/newsletter/*, /api/health
  app.use("/api/reservations", async (req, res) => {
    try {
      const url = `${FLASK_BASE}/api/reservations${req.url}`;
      const response = await axios({
        method: req.method as any,
        url,
        data: req.body,
        params: req.query,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      });
      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error("[Flask Proxy] Reservation error:", error.message);
      res.status(502).json({ error: "Backend service unavailable" });
    }
  });

  app.use("/api/newsletter", async (req, res) => {
    try {
      const url = `${FLASK_BASE}/api/newsletter${req.url}`;
      const response = await axios({
        method: req.method as any,
        url,
        data: req.body,
        params: req.query,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      });
      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error("[Flask Proxy] Newsletter error:", error.message);
      res.status(502).json({ error: "Backend service unavailable" });
    }
  });

  app.get("/api/health", async (_req, res) => {
    try {
      const response = await axios.get(`${FLASK_BASE}/api/health`);
      res.json(response.data);
    } catch (error: any) {
      res.status(502).json({ error: "Flask backend unavailable" });
    }
  });
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
