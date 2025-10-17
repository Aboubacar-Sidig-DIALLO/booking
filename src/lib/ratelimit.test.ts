import { describe, it, expect } from "vitest";
import { rateLimit } from "./ratelimit";

describe("rateLimit", () => {
  it("permet quelques requêtes puis bloque", () => {
    let allowed = 0;
    for (let i = 0; i < 12; i++) {
      if (rateLimit("key:test", 5, 60000)) allowed++;
    }
    expect(allowed).toBe(5);
  });
});
