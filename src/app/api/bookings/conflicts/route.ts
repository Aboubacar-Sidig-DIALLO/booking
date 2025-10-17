import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  if (!roomId || !start || !end)
    return NextResponse.json({ error: "MISSING_PARAMS" }, { status: 400 });

  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      start: { lt: new Date(end) },
      end: { gt: new Date(start) },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { id: true, title: true, start: true, end: true },
    orderBy: { start: "asc" },
  });
  return NextResponse.json({ conflict });
}
