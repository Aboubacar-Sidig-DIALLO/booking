import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createEvent } from "ics";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const b = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });
  if (!b) return new Response("Not Found", { status: 404 });
  const start = new Date(b.start);
  const end = new Date(b.end);
  const { error, value } = createEvent({
    title: b.title,
    description: b.description ?? undefined,
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
    ],
    end: [
      end.getFullYear(),
      end.getMonth() + 1,
      end.getDate(),
      end.getHours(),
      end.getMinutes(),
    ],
    location: b.room?.name,
  });
  if (error || !value) return new Response("ICS error", { status: 500 });
  return new Response(value, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=booking-${b.id}.ics`,
    },
  });
}
