import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const features = await prisma.feature.findMany({
    include: { rooms: true },
    orderBy: { name: "asc" },
  });
  const data = features
    .map((f) => ({ feature: f.name, count: f.rooms.length }))
    .sort((a, b) => b.count - a.count);
  return NextResponse.json(data);
}
