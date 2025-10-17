import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publish } from "@/lib/upstash";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { userId } = await req.json().catch(() => ({ userId: undefined }));
  if (!userId)
    return NextResponse.json({ error: "MISSING_USER" }, { status: 400 });
  const existing = await prisma.checkin.findFirst({
    where: { bookingId: id, userId },
  });
  if (existing?.checkedInAt) return NextResponse.json({ ok: true });
  const checkin = await prisma.checkin.upsert({
    where: { bookingId_userId: { bookingId: id, userId } },
    update: { checkedInAt: new Date() },
    create: { bookingId: id, userId, checkedInAt: new Date() },
  });
  await publish("events", {
    event: "checkin.updated",
    payload: { bookingId: id, userId },
  });
  return NextResponse.json(checkin);
}
