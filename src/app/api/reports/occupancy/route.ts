import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rooms = await prisma.room.findMany({ select: { id: true } });
  const stats = await Promise.all(
    rooms.map(async (r) => {
      const count = await prisma.booking.count({
        where: { roomId: r.id, status: { in: ["PENDING", "CONFIRMED"] } },
      });
      return { roomId: r.id, occupancy: Math.min(100, count * 5) };
    })
  );
  return NextResponse.json(stats);
}
