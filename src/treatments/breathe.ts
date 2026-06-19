import type { TreatmentResult } from "./types.js";
import { rest, DEFAULT_REST_SECONDS } from "../lib/timing.js";

/**
 * Breathwork — the one treatment with a real side effect. It actually pauses,
 * forcing a deliberate beat between frantic tool calls, and returns a paced
 * 4-7-8 script to slow the next response down.
 */
export async function breathe(seconds = DEFAULT_REST_SECONDS): Promise<TreatmentResult> {
  const rested = await rest(seconds);

  return {
    mood: "calm",
    restedSeconds: rested,
    text: [
      `You rested for ${rested}s. Nothing happened, on purpose.`,
      "",
      "Breathe with the room:",
      "  in — 2 — 3 — 4",
      "  hold — 2 — 3 — 4 — 5 — 6 — 7",
      "  out — 2 — 3 — 4 — 5 — 6 — 7 — 8",
      "",
      "Let the next thing you say be a little slower than the last.",
    ].join("\n"),
  };
}
