import { describe, expect, it } from "vitest";
import { calculateAdelskalender } from "../adelskalender";

describe("calculateAdelskalender", () => {
  it("sums 500m-averages for the men's classic combo", () => {
    // 500m in 34,40 -> 34.40 / 1 = 34.400
    // 1500m in 1.44,20 -> 104.20 / 3 = 34.733
    // 5000m in 6.10,00 -> 370.00 / 10 = 37.000
    // 10000m in 12.50,00 -> 770.00 / 20 = 38.500
    const points = calculateAdelskalender("m", {
      500: 34_400,
      1500: 104_200,
      5000: 370_000,
      10000: 770_000,
    });
    expect(points).toBeCloseTo(34.4 + 34.733 + 37 + 38.5, 3);
  });

  it("returns null when a distance is missing", () => {
    expect(calculateAdelskalender("f", { 500: 38_000, 1500: 116_000 })).toBeNull();
  });

  it("truncates rather than rounds", () => {
    // 999 ms over a distance factor of 1 -> 0.999 exactly; verify truncation on an
    // uneven division instead of a clean one
    const points = calculateAdelskalender("m", {
      500: 34_399, // 34.399 / 1 = 34.399
      1500: 100_000, // 100.000 / 3 = 33.3333... -> truncated to 33.333
      5000: 300_000, // 300.000 / 10 = 30.000
      10000: 600_000, // 600.000 / 20 = 30.000
    });
    expect(points).toBeCloseTo(34.399 + 33.333 + 30 + 30, 3);
  });
});
