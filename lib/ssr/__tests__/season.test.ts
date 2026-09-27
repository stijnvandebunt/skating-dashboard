import { describe, expect, it } from "vitest";
import { seasonForDate } from "../season";

describe("seasonForDate", () => {
  it("assigns autumn/winter dates to the year they occur in", () => {
    expect(seasonForDate("2025-11-09")).toBe(2025);
    expect(seasonForDate("2025-12-28")).toBe(2025);
  });

  it("assigns spring dates to the previous year's season", () => {
    expect(seasonForDate("2025-03-14")).toBe(2024);
    expect(seasonForDate("2026-01-10")).toBe(2025);
  });

  it("treats July as the season boundary", () => {
    expect(seasonForDate("2024-07-01")).toBe(2024);
    expect(seasonForDate("2024-06-30")).toBe(2023);
  });
});
