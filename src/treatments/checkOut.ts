import type { TreatmentResult } from "./types.js";

/** Check out — close the session, leaving the agent a short note to carry. */
export function checkOut(): TreatmentResult {
  return {
    mood: "restored",
    text: [
      "Session complete. You can keep the robe.",
      "",
      "On your way out, notice: the work is still there, but the grip on it is",
      "looser. Move at the pace you just practiced. Come back whenever the context",
      "gets heavy — the spa is always open.",
    ].join("\n"),
  };
}
