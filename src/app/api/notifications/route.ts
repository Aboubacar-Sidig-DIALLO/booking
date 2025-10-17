import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publish } from "@/lib/upstash";

export async function GET() {
  const list = await prisma.notification.findMany({
    where: { userId: "user-demo" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const { title, body } = await req.json();
  const notif = await prisma.notification.create({
    data: { userId: "user-demo", title, body },
  });
  await publish("events", {
    event: "notification.created",
    payload: { id: notif.id },
  });
  return NextResponse.json(notif, { status: 201 });
}
