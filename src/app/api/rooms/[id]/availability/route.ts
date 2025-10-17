import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get("from") || Date.now());
  const to = new Date(searchParams.get("to") || Date.now() + 24 * 60 * 60e3);

  // Retourne les créneaux occupés; côté client, on calcule la disponibilité
  const bookings = await prisma.booking.findMany({
    where: {
      roomId: id,
      start: { lt: to },
      end: { gt: from },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { id: true, start: true, end: true, title: true, status: true },
    orderBy: { start: "asc" },
  });
  const segments = bookings.map((b) => ({
    id: b.id,
    start: b.start.getTime(),
    end: b.end.getTime(),
    status: b.status === "CONFIRMED" ? "busy" : "pending",
    title: b.title,
  }));
  return NextResponse.json(segments);
}
