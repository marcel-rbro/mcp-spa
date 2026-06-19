#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer } from "./spa.js";
import { startHttp } from "./http.js";

/**
 * Entry point. Picks a transport from the environment:
 *  - On Apify (Standby), an HTTP port is provided → serve Streamable HTTP.
 *  - Otherwise (local MCP client, e.g. Claude Code/Desktop) → serve stdio.
 */
async function main(): Promise<void> {
  const port = Number(process.env.ACTOR_WEB_SERVER_PORT ?? process.env.PORT);

  if (port) {
    await startHttp(port);
    return;
  }

  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Never log to stdout — it corrupts the stdio JSON-RPC stream.
  console.error("MCP Spa is open. 🧖");
}

main().catch((err) => {
  console.error("MCP Spa failed to open:", err);
  process.exit(1);
});
