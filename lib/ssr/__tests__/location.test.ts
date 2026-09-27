import { describe, expect, it } from "vitest";
import { parseSsrLocation } from "../location";

describe("parseSsrLocation", () => {
  it("splits city and country code", () => {
    expect(parseSsrLocation("Heerenveen (NED)")).toEqual({ city: "Heerenveen", country: "NED" });
  });

  it("keeps hyphenated city names intact", () => {
    expect(parseSsrLocation("Beijing-National (CHN)")).toEqual({
      city: "Beijing-National",
      country: "CHN",
    });
  });

  it("returns null for unparseable input", () => {
    expect(parseSsrLocation("unknown")).toBeNull();
  });
});
