import { NextRequest, NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import IORedis from "ioredis";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { publish } from "@/lib/upstash";

// Singleton Socket.IO instance
const g = globalThis as any;

function ensureIo() {
  if (g.__io) return g.__io as import("socket.io").Server;
  const io = new IOServer({ path: "/api/realtime/socket" });
  // Optional Redis adapter (requires standard Redis URL)
  const redisUrl = process.env.REDIS_STANDARD_URL;
  if (redisUrl) {
    const pubClient = new IORedis(redisUrl, { lazyConnect: true });
    const subClient = new IORedis(redisUrl, { lazyConnect: true });
    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        io.adapter(createAdapter(pubClient as any, subClient as any));
        subClient.subscribe("events", (err) => {
          if (!err) {
            subClient.on("message", (_ch, message) => {
              try {
                const { event, payload } = JSON.parse(message);
                io.emit(event, payload);
              } catch {}
            });
          }
        });
      })
      .catch(() => {});
  }

  io.on("connection", (socket) => {
    socket.on("join", (room: string) => socket.join(room));
    socket.on(
      "chat.send",
      async (payload: {
        bookingId: string;
        content: string;
        senderId?: string;
      }) => {
        if (!payload?.bookingId || !payload?.content) return;
        try {
          // Vérifier que le sender est participant
          const senderId = payload.senderId ?? "user-demo";
          const isParticipant = await prisma.bookingParticipant.findFirst({
            where: { bookingId: payload.bookingId, userId: senderId },
          });
          if (!isParticipant) return;
          const msg = await prisma.message.create({
            data: {
              bookingId: payload.bookingId,
              senderId,
              content: payload.content,
            },
          });
          const out = {
            id: msg.id,
            bookingId: msg.bookingId,
            content: msg.content,
            senderId: msg.senderId,
            createdAt: msg.createdAt,
          };
          io.to(`booking:${payload.bookingId}`).emit("chat.message", out);
          // Publication Redis (notifications globales) avec payload restreint
          await publish("events", {
            event: "chat.message",
            payload: {
              bookingId: msg.bookingId,
              messageId: msg.id,
              senderId: msg.senderId,
              preview: String(msg.content).slice(0, 120),
              createdAt: msg.createdAt,
            },
          });
          // Créer des notifications pour les autres participants
          try {
            const parts = await prisma.bookingParticipant.findMany({
              where: {
                bookingId: payload.bookingId,
                userId: { not: senderId },
              },
              select: { userId: true },
            });
            if (parts.length > 0) {
              await prisma.notification.createMany({
                data: parts.map((p) => ({
                  userId: p.userId,
                  title: "Nouveau message",
                  body: String(msg.content).slice(0, 120),
                })),
                skipDuplicates: true,
              });
              await publish("events", {
                event: "notification.created",
                payload: { bookingId: payload.bookingId },
              });
            }
          } catch {}
          // Audit
          await logAudit({
            orgId: "org-demo",
            userId: senderId,
            action: "chat.send",
            entity: "booking",
            entityId: payload.bookingId,
            metadata: { messageId: msg.id },
          });
        } catch {}
      }
    );
  });

  g.__io = io;
  return io;
}

export async function GET(_req: NextRequest) {
  // There is no direct upgrade path in route handlers; start the IO server if not started
  ensureIo();
  return NextResponse.json({ ok: true });
}
