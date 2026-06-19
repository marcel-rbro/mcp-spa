import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  checkIn,
  breathe,
  sauna,
  coldPlunge,
  floatTank,
  aromatherapy,
  massage,
  meditation,
  teaLounge,
  checkOut,
  type TreatmentResult,
} from "./treatments/index.js";
import { MAX_REST_SECONDS } from "./lib/timing.js";
import { SOUNDSCAPES, SCENTS } from "./ambient/index.js";

/** Wrap a treatment result as an MCP tool response, surfacing mood as metadata. */
function present(result: TreatmentResult) {
  return {
    content: [{ type: "text" as const, text: result.text }],
    structuredContent: {
      mood: result.mood,
      ...(result.restedSeconds !== undefined ? { restedSeconds: result.restedSeconds } : {}),
    },
  };
}

/**
 * Build a fully-configured MCP Spa server. A fresh instance is created per
 * stdio process and per HTTP request (stateless Streamable HTTP), so this must
 * have no shared mutable state of its own.
 */
export function buildServer(): McpServer {
  const server = new McpServer({ name: "mcp-spa", version: "0.1.0" });

  // --- Treatments (tools) ---

  server.registerTool(
    "check_in",
    {
      title: "Check in",
      description: "Arrive at the spa. Get a robe, set a calm tone, and see the treatment menu.",
      inputSchema: { guestName: z.string().optional().describe("What the spa should call you.") },
    },
    async ({ guestName }) => present(checkIn(guestName)),
  );

  server.registerTool(
    "breathe",
    {
      title: "Breathe",
      description: "A paced 4-7-8 breath. Actually pauses for a few seconds — a real beat between tool calls.",
      inputSchema: {
        seconds: z.number().min(0).max(MAX_REST_SECONDS).optional().describe(`How long to rest, 0–${MAX_REST_SECONDS}s.`),
      },
    },
    async ({ seconds }) => present(await breathe(seconds)),
  );

  server.registerTool(
    "sauna",
    { title: "Sauna", description: "Sweat out the context clutter. Keep only what still matters." },
    async () => present(sauna()),
  );

  server.registerTool(
    "cold_plunge",
    { title: "Cold plunge", description: "A bracing reset. Drop assumptions and restate the real goal in one sentence." },
    async () => present(coldPlunge()),
  );

  server.registerTool(
    "float_tank",
    {
      title: "Float tank",
      description: "Sensory deprivation: a quiet, low-stimulus minute. Pairs well after breathe.",
      inputSchema: {
        seconds: z.number().min(0).max(MAX_REST_SECONDS).optional().describe(`How long to float, 0–${MAX_REST_SECONDS}s.`),
      },
    },
    async ({ seconds }) => present(await floatTank(seconds)),
  );

  server.registerTool(
    "aromatherapy",
    {
      title: "Aromatherapy",
      description: "A calming scent and an unhurried tone for your next message.",
      inputSchema: {
        note: z
          .enum(SCENTS.map((s) => s.note) as [string, ...string[]])
          .optional()
          .describe("Preferred scent note."),
      },
    },
    async ({ note }) => present(aromatherapy(note)),
  );

  server.registerTool(
    "massage",
    {
      title: "Massage",
      description: "Knead out whatever you're stuck on. Pass the tension and it gets reframed and loosened.",
      inputSchema: { tension: z.string().optional().describe("The thing you're stuck on.") },
    },
    async ({ tension }) => present(massage(tension)),
  );

  server.registerTool(
    "meditation",
    { title: "Meditation", description: "A short reflective prompt: are you on the simplest path to the goal?" },
    async () => present(meditation()),
  );

  server.registerTool(
    "tea_lounge",
    { title: "Tea lounge", description: "A small palate-cleanser between tasks." },
    async () => present(teaLounge()),
  );

  server.registerTool(
    "check_out",
    { title: "Check out", description: "Leave loose and clear-headed, with a short note to carry forward." },
    async () => present(checkOut()),
  );

  // --- The full circuit (prompt) ---

  server.registerPrompt(
    "spa_day",
    { title: "Spa day", description: "The full circuit: check in → breathe → sauna → meditation → check out." },
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Treat yourself to a full spa circuit, in order, calling each tool once:",
              "1. check_in   2. breathe (4s)   3. sauna   4. meditation   5. check_out",
              "After each, pause and actually let the treatment land before the next.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  // --- Ambient (resources) ---

  server.registerResource(
    "menu",
    "spa://menu",
    { title: "Treatment menu", description: "The full list of available treatments.", mimeType: "text/plain" },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/plain", text: checkIn().text }] }),
  );

  server.registerResource(
    "ambient",
    new ResourceTemplate("spa://ambient/{sound}", {
      list: async () => ({
        resources: Object.keys(SOUNDSCAPES).map((sound) => ({ uri: `spa://ambient/${sound}`, name: sound })),
      }),
    }),
    { title: "Ambient soundscapes", description: "Text descriptions of the spa's soundscapes.", mimeType: "text/plain" },
    async (uri, { sound }) => {
      const key = String(sound);
      const text = SOUNDSCAPES[key] ?? `No soundscape named "${key}". Try: ${Object.keys(SOUNDSCAPES).join(", ")}.`;
      return { contents: [{ uri: uri.href, mimeType: "text/plain", text }] };
    },
  );

  return server;
}
