import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Recommandation simple: trouve une salle du même site/capacité sans conflit
export async function POST(req: NextRequest) {
  const { siteId, capacity, start, end } = await req.json();
  if (!start || !end)
    return NextResponse.json({ error: "MISSING_INTERVAL" }, { status: 400 });
  const rooms = await prisma.room.findMany({
    where: {
      isActive: true,
      ...(siteId ? { siteId } : {}),
      ...(capacity ? { capacity: { gte: capacity } } : {}),
    },
    select: { id: true, name: true, capacity: true },
    orderBy: { capacity: "asc" },
  });

  const s = new Date(start);
  const e = new Date(end);
  for (const r of rooms) {
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: r.id,
        start: { lt: e },
        end: { gt: s },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { id: true },
    });
    if (!conflict) return NextResponse.json({ room: r });
  }
  return NextResponse.json({ room: null });
}
