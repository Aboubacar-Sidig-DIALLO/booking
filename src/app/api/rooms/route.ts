import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateRoomSchema } from "@/lib/zod";
import { assertCan } from "@/lib/rbac";
import { requireAuth } from "@/lib/withAuth";

// GET /api/rooms
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId") || undefined;
  const minCapacity = Number(searchParams.get("capacity") || 0);
  const q = searchParams.get("q") || undefined;

  const where: any = {
    isActive: true,
    ...(siteId ? { siteId } : {}),
    ...(minCapacity ? { capacity: { gte: minCapacity } } : {}),
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
  };

  const rooms = await prisma.room.findMany({
    where,
    include: { features: { include: { feature: true } }, site: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(rooms);
}

// POST /api/rooms
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  assertCan(((session as any).user?.role ?? "VIEWER") as any, "rooms:create");

  const json = await req.json();
  const data = CreateRoomSchema.parse(json);

  const room = await prisma.room.create({
    data: {
      orgId: "org-demo", // TODO: org du user
      siteId: data.siteId,
      name: data.name,
      slug: data.slug,
      capacity: data.capacity,
      location: data.location,
      floor: data.floor ?? null,
      description: data.description,
      isActive: data.isActive,
    },
  });

  if (data.featureIds?.length) {
    await prisma.roomFeature.createMany({
      data: data.featureIds.map((fid) => ({ roomId: room.id, featureId: fid })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json(room, { status: 201 });
}
