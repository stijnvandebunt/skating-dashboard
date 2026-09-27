import { describe, expect, it } from "vitest";
import { parseSsrTime, formatMsAsSsrTime } from "../time";

describe("parseSsrTime", () => {
  it("parses sub-minute times", () => {
    expect(parseSsrTime("34,40")).toBe(34_400);
  });

  it("parses times over a minute", () => {
    expect(parseSsrTime("1.14,32")).toBe(74_320);
  });

  it("parses multi-minute times", () => {
    expect(parseSsrTime("13.45,67")).toBe(825_670);
  });

  it("pads short hundredths", () => {
    expect(parseSsrTime("34,4")).toBe(34_400);
  });

  it("returns null for garbage input", () => {
    expect(parseSsrTime("DNF")).toBeNull();
    expect(parseSsrTime("")).toBeNull();
  });
});

describe("formatMsAsSsrTime", () => {
  it("round-trips sub-minute times", () => {
    expect(formatMsAsSsrTime(34_400)).toBe("34,40");
  });

  it("round-trips times over a minute", () => {
    expect(formatMsAsSsrTime(74_320)).toBe("1.14,32");
  });
});
