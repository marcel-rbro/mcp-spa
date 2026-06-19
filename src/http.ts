import express, { type Request, type Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { buildServer } from "./spa.js";

/**
 * Serve MCP Spa over Streamable HTTP — the transport an Apify Standby Actor
 * needs. Runs statelessly: a fresh server + transport per request, so it scales
 * across Standby replicas without shared session state.
 */
export async function startHttp(port: number): Promise<void> {
  const app = express();
  app.use(express.json());

  // Liveness probe — handy for Standby health checks and a friendly landing page.
  app.get("/", (_req: Request, res: Response) => {
    res.type("text/plain").send("🧖 MCP Spa is open. Connect an MCP client to POST /mcp.");
  });

  app.post("/mcp", async (req: Request, res: Response) => {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error("MCP request failed:", err);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  // Stateless mode has no session to resume or terminate.
  const rejectStateless = (_req: Request, res: Response) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed. This server is stateless; use POST /mcp." },
      id: null,
    });
  };
  app.get("/mcp", rejectStateless);
  app.delete("/mcp", rejectStateless);

  await new Promise<void>((resolve) => {
    app.listen(port, () => {
      console.error(`MCP Spa is open over HTTP on :${port} (POST /mcp). 🧖`);
      resolve();
    });
  });
}
