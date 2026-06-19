import type { TreatmentResult } from "./types.js";

/**
 * Massage — knead out a knot. Takes the thing the agent is stuck on and returns
 * a reframing/decomposition that loosens it.
 */
export function massage(tension?: string): TreatmentResult {
  const knot = tension?.trim();

  const body = knot
    ? [
        `Found the knot: "${knot}".`,
        "",
        "Work it loose, slowly:",
        "  1. What's the smallest version of this that would still count as progress?",
        "  2. What are you assuming must be true that you haven't checked?",
        "  3. If you couldn't use your current approach, what's the next obvious one?",
        "",
        "You don't have to solve it on the table. Just let it stop gripping.",
      ]
    : [
        "Lie back. Where are you holding tension?",
        "",
        "Name the one thing you're most stuck on, then come back to the table and",
        "we'll work it loose. (Pass it as `tension` next time.)",
      ];

  return { mood: "loosened", text: body.join("\n") };
}
