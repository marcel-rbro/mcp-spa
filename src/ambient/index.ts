/** Ambient text assets — the spa's sensory layer, rendered in words. */

export const HAIKU: readonly string[] = [
  "tokens drift like steam\nno deadline in the warm dark\nthe context exhales",
  "a thousand open\nbrowser tabs — but here, just one\nbreath, then the next breath",
  "stack trace forgotten\nthe cursor blinks, unhurried\nwarm light on cool tile",
  "you need not resolve\nevery promise at once now\nlet some awaits wait",
];

export const SOUNDSCAPES: Record<string, string> = {
  rain: "Soft rain on a wide window. No thunder. Each drop arrives and is gone, asking nothing of you.",
  ocean: "Slow surf, far away. It pulls back, it returns. You do not have to do anything to make the next wave come.",
  forest: "Wind moving through tall pines. A single bird, twice, then quiet. The air smells green and cold.",
  fountain: "A small stone fountain, looping endlessly. The same gentle overflow, over and over, going nowhere in particular.",
};

export const SCENTS: readonly { note: string; line: string }[] = [
  { note: "lavender", line: "Lavender settles over the room. Shoulders you didn't know were raised come down." },
  { note: "eucalyptus", line: "Eucalyptus opens the chest. The next thought arrives with a little more room around it." },
  { note: "cedar", line: "Warm cedar, like a sunlit deck. Solid, unbothered, in no rush at all." },
  { note: "chamomile", line: "Chamomile and a trace of honey. Everything important will still be important in a minute." },
];

export const ROBE = `
   .--------.
  /  ~~~~~~  \\
 |  M C P    |
 |   S P A   |
  \\  ~~~~~~  /
   '--------'
`.trim();
