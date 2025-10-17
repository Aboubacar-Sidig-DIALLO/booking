import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publish } from "@/lib/upstash";
import { UpdateBookingSchema } from "@/lib/zod";
import { assertCan } from "@/lib/rbac";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true, participants: true },
  });
  if (!booking)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  assertCan("EMPLOYEE" as any, "bookings:update");
  const data = UpdateBookingSchema.parse(await req.json());

  // Option: vérifier conflit si start/end changent
  if (data.start && data.end) {
    const overlap = await prisma.booking.findFirst({
      where: {
        id: { not: id },
        roomId: (
          await prisma.booking.findUnique({
            where: { id },
            select: { roomId: true },
          })
        )?.roomId,
        start: { lt: new Date(data.end) },
        end: { gt: new Date(data.start) },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { id: true },
    });
    if (overlap)
      return NextResponse.json({ error: "CONFLICT" }, { status: 409 });
  }

  const { participants, ...rest } = data as any;
  const booking = await prisma.booking.update({ where: { id }, data: rest });
  if (participants) {
    await prisma.bookingParticipant.deleteMany({ where: { bookingId: id } });
    await prisma.bookingParticipant.createMany({
      data: participants.map((p: any) => ({
        bookingId: id,
        userId: p.userId,
        role: p.role,
      })),
      skipDuplicates: true,
    });
  }
  await publish("events", {
    event: "booking.updated",
    payload: { id: booking.id },
  });
  return NextResponse.json(booking);
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  assertCan("EMPLOYEE" as any, "bookings:delete");
  await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
  await publish("events", { event: "booking.cancelled", payload: { id } });
  return NextResponse.json({ ok: true });
}
