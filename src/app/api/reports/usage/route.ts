import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "month";
  const since = new Date();
  since.setMonth(since.getMonth() - 1);
  const bookings = await prisma.booking.count({
    where: {
      createdAt: { gte: since },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });
  return NextResponse.json({ period, count: bookings });
}
