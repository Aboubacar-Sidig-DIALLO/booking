import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/withAuth";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await ctx.params;
  const session = await requireAuth(req);
  const userId = (session as any).user?.id as string;
  const isParticipant = await prisma.bookingParticipant.findFirst({
    where: { bookingId, userId },
  });
  if (!isParticipant)
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const list = await prisma.message.findMany({
    where: { bookingId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(list);
}
