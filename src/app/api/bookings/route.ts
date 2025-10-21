import { NextRequest, NextResponse } from "next/server";
import {
  createSecurePrismaClient,
  getTenantIdFromRequest,
} from "@/lib/prisma-tenant";
import { publish } from "@/lib/upstash";
import { CreateBookingSchema } from "@/lib/zod";
import { assertCan } from "@/lib/rbac";
import { requireAuth } from "@/lib/withAuth";
import { ratelimitCheck } from "@/lib/upstash";
import {
  withTenantSecurity,
  withValidation,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import { logTenantAction, extractRequestInfo } from "@/lib/audit-logging";

// POST /api/bookings
export const POST = withTenantSecurity(
  withValidation(
    CreateBookingSchema,
    async (req: NextRequest, { tenantId, validatedData }) => {
      const session = await requireAuth(req);
      if (!(session as any).user?.id) {
        return createErrorResponse("UNAUTHENTICATED", 401);
      }

      assertCan(
        ((session as any).user?.role ?? "VIEWER") as any,
        "bookings:create"
      );

      const rl = await ratelimitCheck(`bookings:${(session as any).user.id}`);
      if (!rl.success) {
        return createErrorResponse("RATE_LIMITED", 429);
      }

      const prisma = createSecurePrismaClient(req);
      const { ipAddress, userAgent } = extractRequestInfo(req);

      // Anti-conflit basique
      const overlap = await prisma.booking.findFirst({
        where: {
          roomId: validatedData.roomId,
          start: { lt: new Date(validatedData.end) },
          end: { gt: new Date(validatedData.start) },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        select: { id: true },
      });

      if (overlap) {
        return createErrorResponse("CONFLICT", 409);
      }

      const booking = await prisma.booking.create({
        data: {
          roomId: validatedData.roomId,
          title: validatedData.title,
          description: validatedData.description,
          start: new Date(validatedData.start),
          end: new Date(validatedData.end),
          privacy: validatedData.privacy,
          status: "CONFIRMED",
          recurrenceRule: validatedData.recurrenceRule,
          createdById: (session as any).user.id,
        },
      });

      if (validatedData.participants?.length) {
        await prisma.bookingParticipant.createMany({
          data: validatedData.participants.map((p: any) => ({
            bookingId: booking.id,
            userId: p.userId,
            role: p.role,
          })),
        });
      }

      // Log de l'action
      await logTenantAction({
        tenantId,
        userId: (session as any).user.id,
        action: "CREATE_BOOKING",
        entity: "booking",
        entityId: booking.id,
        metadata: {
          roomId: booking.roomId,
          start: booking.start,
          end: booking.end,
          title: booking.title,
        },
        ipAddress,
        userAgent,
      });

      await publish("events", {
        event: "booking.created",
        payload: {
          id: booking.id,
          roomId: booking.roomId,
          start: booking.start,
          end: booking.end,
        },
      });

      return createSuccessResponse(booking, "Réservation créée avec succès");
    }
  )
);

// GET /api/bookings?mine=1
export const GET = withTenantSecurity(
  async (req: NextRequest, { tenantId }) => {
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine") === "1";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const roomId = searchParams.get("roomId");

    const prisma = createSecurePrismaClient(req);

    const where: any = {};

    if (mine) {
      where.participants = { some: { userId: "user-demo" } }; // TODO: Récupérer l'ID utilisateur depuis la session
    }

    if (startDate) {
      where.start = { gte: new Date(startDate) };
    }

    if (endDate) {
      where.end = { lte: new Date(endDate) };
    }

    if (status) {
      where.status = status;
    }

    if (roomId) {
      where.roomId = roomId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { start: "desc" },
      include: {
        room: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return createSuccessResponse(bookings);
  }
);
