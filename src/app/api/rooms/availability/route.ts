import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { timeRange } = await request.json();

    if (!timeRange?.from || !timeRange?.to) {
      return NextResponse.json(
        { error: "Paramètres de temps requis" },
        { status: 400 }
      );
    }

    const startTime = new Date(timeRange.from);
    const endTime = new Date(timeRange.to);

    // Récupérer toutes les salles avec leurs informations
    const rooms = await prisma.room.findMany({
      include: {
        site: {
          select: {
            name: true,
          },
        },
        features: {
          include: {
            feature: {
              select: {
                name: true,
                icon: true,
              },
            },
          },
        },
        bookings: {
          where: {
            AND: [
              {
                OR: [
                  {
                    AND: [
                      { start: { lte: startTime } },
                      { end: { gt: startTime } },
                    ],
                  },
                  {
                    AND: [
                      { start: { lt: endTime } },
                      { end: { gte: endTime } },
                    ],
                  },
                  {
                    AND: [
                      { start: { gte: startTime } },
                      { end: { lte: endTime } },
                    ],
                  },
                ],
              },
              {
                status: {
                  in: ["CONFIRMED", "PENDING"],
                },
              },
            ],
          },
          select: {
            id: true,
            title: true,
            start: true,
            end: true,
            status: true,
          },
        },
      },
    });

    // Calculer la disponibilité réelle pour chaque salle (sans simulation)
    const roomsWithAvailability = rooms.map((room: any) => {
      const hasOverlap = room.bookings && room.bookings.length > 0;
      const firstOverlap = hasOverlap ? room.bookings[0] : null;

      return {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        site: room.site,
        features: room.features,
        isAvailable: !hasOverlap,
        conflictingBooking: firstOverlap
          ? {
              title: firstOverlap.title,
              startTime: firstOverlap.start,
              endTime: firstOverlap.end,
              status: firstOverlap.status,
            }
          : null,
      };
    });

    return NextResponse.json(roomsWithAvailability);
  } catch (error) {
    console.error("Erreur lors de la vérification de disponibilité:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
