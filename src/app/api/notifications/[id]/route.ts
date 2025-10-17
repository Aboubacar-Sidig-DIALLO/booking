import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publish } from "@/lib/upstash";

export async function PATCH(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const notif = await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
  await publish("events", {
    event: "notification.read",
    payload: { id: notif.id },
  });
  return NextResponse.json(notif);
}
