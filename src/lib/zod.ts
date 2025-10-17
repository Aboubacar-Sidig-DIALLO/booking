import { z } from "zod";

export const bookingSchema = z.object({
  roomId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional().nullable(),
  from: z.string(),
  to: z.string(),
  privacy: z.enum(["public", "private", "confidential"]).default("public"),
  recurrence: z.string().optional().nullable(),
  participants: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["host", "required", "optional"]).default("required"),
      })
    )
    .default([]),
});

export type BookingInput = z.infer<typeof bookingSchema>;

// Backend strict schemas
export const CreateBookingSchema = z
  .object({
    roomId: z.string().uuid(),
    title: z.string().min(3).max(120),
    description: z.string().max(1000).optional(),
    start: z.string().datetime(),
    end: z.string().datetime(),
    privacy: z.enum(["PUBLIC", "ORG", "INVITEES"]).default("ORG"),
    participants: z
      .array(
        z.object({
          userId: z.string().uuid(),
          role: z.enum(["HOST", "REQUIRED", "OPTIONAL"]).default("REQUIRED"),
        })
      )
      .max(50)
      .default([]),
    recurrenceRule: z.string().optional(),
  })
  .refine((d) => new Date(d.end) > new Date(d.start), {
    path: ["end"],
    message: "end must be after start",
  });

export const UpdateBookingSchema = z
  .object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().max(1000).optional(),
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
    status: z
      .enum(["PENDING", "CONFIRMED", "CANCELLED", "REJECTED", "EXPIRED"])
      .optional(),
    privacy: z.enum(["PUBLIC", "ORG", "INVITEES"]).optional(),
    participants: z
      .array(
        z.object({
          userId: z.string().uuid(),
          role: z.enum(["HOST", "REQUIRED", "OPTIONAL"]).default("REQUIRED"),
        })
      )
      .max(50)
      .optional(),
    recurrenceRule: z.string().optional(),
  })
  .refine((d) => !(d.start && d.end) || new Date(d.end!) > new Date(d.start!), {
    path: ["end"],
    message: "end must be after start",
  });

export const CreateRoomSchema = z.object({
  siteId: z.string().uuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  capacity: z.number().int().positive(),
  location: z.string().optional(),
  floor: z.number().int().optional(),
  description: z.string().optional(),
  featureIds: z.array(z.string().uuid()).default([]),
  isActive: z.boolean().default(true),
});
