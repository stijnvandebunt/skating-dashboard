import { describe, expect, it } from "vitest";
import { parseSsrLink } from "../link";

describe("parseSsrLink", () => {
  it("extracts competition and race ids", () => {
    expect(parseSsrLink("http://speedskatingresults.com/index.php?p=3&e=20389&r=13&s=1598")).toEqual({
      competitionId: 20389,
      raceId: 13,
    });
  });

  it("handles missing params", () => {
    expect(parseSsrLink("http://speedskatingresults.com/index.php?p=2&e=10628")).toEqual({
      competitionId: 10628,
      raceId: null,
    });
  });

  it("returns nulls for an invalid link", () => {
    expect(parseSsrLink("not-a-url")).toEqual({ competitionId: null, raceId: null });
  });
});
