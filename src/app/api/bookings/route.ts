import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publish } from "@/lib/upstash";
import { CreateBookingSchema } from "@/lib/zod";
import { assertCan } from "@/lib/rbac";
import { requireAuth } from "@/lib/withAuth";
import { ratelimitCheck } from "@/lib/upstash";

// POST /api/bookings
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!(session as any).user?.id)
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  assertCan(
    ((session as any).user?.role ?? "VIEWER") as any,
    "bookings:create"
  );
  const json = await req.json();
  const data = CreateBookingSchema.parse(json);

  const rl = await ratelimitCheck(`bookings:${(session as any).user.id}`);
  if (!rl.success)
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });

  // Anti-conflit basique
  const overlap = await prisma.booking.findFirst({
    where: {
      roomId: data.roomId,
      start: { lt: new Date(data.end) },
      end: { gt: new Date(data.start) },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { id: true },
  });
  if (overlap) return NextResponse.json({ error: "CONFLICT" }, { status: 409 });

  const booking = await prisma.booking.create({
    data: {
      orgId: "org-demo",
      roomId: data.roomId,
      title: data.title,
      description: data.description,
      start: new Date(data.start),
      end: new Date(data.end),
      privacy: data.privacy,
      status: "CONFIRMED",
      recurrenceRule: data.recurrenceRule,
      createdById: "user-demo",
    },
  });

  if (data.participants?.length) {
    await prisma.bookingParticipant.createMany({
      data: data.participants.map((p) => ({
        bookingId: booking.id,
        userId: p.userId,
        role: p.role,
      })),
    });
  }

  await publish("events", {
    event: "booking.created",
    payload: {
      id: booking.id,
      roomId: booking.roomId,
      start: booking.start,
      end: booking.end,
    },
  });
  return NextResponse.json(booking, { status: 201 });
}

// GET /api/bookings?mine=1
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "1";

  const where = mine ? { participants: { some: { userId: "user-demo" } } } : {};

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { start: "desc" },
    include: { room: true },
  });
  return NextResponse.json(bookings);
}
