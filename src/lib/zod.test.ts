import { describe, it, expect } from "vitest";
import { CreateBookingSchema } from "./zod";

describe("CreateBookingSchema", () => {
  it("valide un payload correct", () => {
    const now = new Date();
    const input = {
      roomId: crypto.randomUUID(),
      title: "Réunion",
      start: now.toISOString(),
      end: new Date(now.getTime() + 3600000).toISOString(),
      privacy: "ORG" as const,
      participants: [],
    };
    const res = CreateBookingSchema.safeParse(input);
    expect(res.success).toBe(true);
  });

  it("rejette si end <= start", () => {
    const now = new Date();
    const input = {
      roomId: crypto.randomUUID(),
      title: "Réunion",
      start: now.toISOString(),
      end: now.toISOString(),
    } as any;
    const res = CreateBookingSchema.safeParse(input);
    expect(res.success).toBe(false);
  });
});
