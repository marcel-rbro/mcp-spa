import { describe, it, expect, beforeEach } from "vitest";
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
} from "../src/treatments/index.js";
import { resetVariation } from "../src/lib/variation.js";
import { clampRest, MAX_REST_SECONDS } from "../src/lib/timing.js";

beforeEach(() => resetVariation());

describe("check_in", () => {
  it("greets by name when given one", () => {
    expect(checkIn("Marcel").text).toContain("Welcome, Marcel.");
  });
  it("falls back to a generic greeting", () => {
    expect(checkIn().text).toContain("Welcome.");
  });
  it("always shows the menu", () => {
    expect(checkIn().text).toContain("breathe");
  });
});

describe("breathe", () => {
  it("rests for the requested (clamped) time and reports it", async () => {
    const r = await breathe(0);
    expect(r.restedSeconds).toBe(0);
    expect(r.mood).toBe("calm");
    expect(r.text).toContain("rested for 0s");
  });
});

describe("clampRest", () => {
  it("caps over-long requests at the max", () => {
    expect(clampRest(9999)).toBe(MAX_REST_SECONDS);
  });
  it("floors negatives at zero", () => {
    expect(clampRest(-5)).toBe(0);
  });
  it("passes sane values through", () => {
    expect(clampRest(4)).toBe(4);
  });
});

describe("float_tank", () => {
  it("rests and stays weightless", async () => {
    const r = await floatTank(0);
    expect(r.restedSeconds).toBe(0);
    expect(r.mood).toBe("weightless");
  });
});

describe("massage", () => {
  it("echoes the named tension", () => {
    expect(massage("flaky test").text).toContain("flaky test");
  });
  it("invites you to name a tension when none given", () => {
    expect(massage().text).toContain("tension");
  });
});

describe("aromatherapy", () => {
  it("honors a requested scent note", () => {
    expect(aromatherapy("eucalyptus").text).toContain("Eucalyptus");
  });
  it("falls back to rotation for an unknown note", () => {
    expect(aromatherapy("not-a-scent").mood).toBe("soothed");
  });
});

describe("variation is deterministic", () => {
  it("meditation rotates haiku in a fixed order after reset", () => {
    const first = meditation().text;
    const second = meditation().text;
    expect(first).not.toBe(second);
    resetVariation();
    expect(meditation().text).toBe(first);
  });
});

describe("simple treatments carry a mood", () => {
  it.each([
    [sauna, "lightened"],
    [coldPlunge, "alert"],
    [meditation, "centered"],
    [teaLounge, "refreshed"],
    [checkOut, "restored"],
  ])("%o", (fn, mood) => {
    const r = (fn as () => { mood: string; text: string })();
    expect(r.mood).toBe(mood);
    expect(r.text.length).toBeGreaterThan(0);
  });
});
