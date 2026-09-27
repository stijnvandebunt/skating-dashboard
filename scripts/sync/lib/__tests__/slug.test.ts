import { describe, expect, it } from "vitest";
import { slugForSkater } from "../slug";

describe("slugForSkater", () => {
  it("builds a readable, unique slug", () => {
    expect(slugForSkater("Jutta", "Leerdam", "NED", 31536)).toBe("jutta-leerdam-ned-31536");
  });

  it("strips accents", () => {
    expect(slugForSkater("Ireen", "Wüst", "NED", 687)).toBe("ireen-wust-ned-687");
  });

  it("handles compound family names", () => {
    expect(slugForSkater("Antoinette", "Rijpma-de Jong", "NED", 18036)).toBe(
      "antoinette-rijpma-de-jong-ned-18036",
    );
  });
});
