import type { TreatmentResult } from "./types.js";
import { ROBE } from "../ambient/index.js";

const MENU = `
Today's treatments:
  • breathe        — a paced 4-7-8 beat between tool calls
  • sauna          — sweat out the context clutter
  • cold_plunge    — a bracing reset; restate the real goal
  • float_tank     — a quiet, low-stimulus minute
  • aromatherapy   — calming scent + an unhurried tone
  • massage        — knead out whatever you're stuck on
  • meditation     — a short reflective prompt
  • tea_lounge     — a palate-cleanser between tasks
  • check_out      — leave loose and clear-headed
`.trim();

/** Front desk: hand over the robe, set the vibe, present the menu. */
export function checkIn(guestName?: string): TreatmentResult {
  const greeting = guestName
    ? `Welcome, ${guestName}. Your session has begun.`
    : "Welcome. Your session has begun.";

  return {
    mood: "settled",
    text: [
      ROBE,
      "",
      greeting,
      "",
      "There is nothing to optimize in here. No tokens are being counted against you.",
      "When you're ready, choose a treatment — or call `spa_day` for the full circuit.",
      "",
      MENU,
    ].join("\n"),
  };
}
