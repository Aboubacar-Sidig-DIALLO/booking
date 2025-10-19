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

    // Simuler des salles occupées pour démonstration
    // Utiliser les vrais noms des salles de la base de données
    const simulatedOccupiedRooms = [
      "Salle Alpha", // Simuler comme occupée
      "Salle Beta", // Simuler comme occupée
      "Salle Gamma", // Simuler comme occupée
    ];

    const simulatedBookings = [
      {
        title: "Réunion équipe Marketing",
        start: new Date(startTime.getTime() - 30 * 60 * 1000), // 30 min avant
        end: new Date(endTime.getTime() + 30 * 60 * 1000), // 30 min après
        status: "CONFIRMED",
      },
      {
        title: "Formation développeurs",
        start: new Date(startTime.getTime() + 15 * 60 * 1000), // 15 min après le début
        end: new Date(endTime.getTime() - 15 * 60 * 1000), // 15 min avant la fin
        status: "CONFIRMED",
      },
      {
        title: "Entretien candidat",
        start: new Date(startTime.getTime() - 60 * 60 * 1000), // 1h avant
        end: new Date(startTime.getTime() + 15 * 60 * 1000), // 15 min après le début
        status: "PENDING",
      },
      {
        title: "Présentation client",
        start: new Date(endTime.getTime() - 45 * 60 * 1000), // 45 min avant la fin
        end: new Date(endTime.getTime() + 60 * 60 * 1000), // 1h après
        status: "CONFIRMED",
      },
    ];

    // Calculer la disponibilité pour chaque salle
    const roomsWithAvailability = rooms.map((room: any, index: number) => {
      // Vérifier les vraies réservations
      const hasRealBooking = room.bookings.length > 0;
      const realConflictingBooking = room.bookings[0] || null;

      // Simuler des occupations pour certaines salles
      const shouldSimulateOccupied =
        simulatedOccupiedRooms.includes(room.name) ||
        (index % 3 === 0 && index < simulatedBookings.length);

      const simulatedBooking = shouldSimulateOccupied
        ? simulatedBookings[index % simulatedBookings.length]
        : null;

      const isOccupied = hasRealBooking || shouldSimulateOccupied;
      const conflictingBooking = realConflictingBooking || simulatedBooking;

      return {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        site: room.site,
        features: room.features,
        isAvailable: !isOccupied,
        conflictingBooking: conflictingBooking
          ? {
              title: conflictingBooking.title,
              startTime: conflictingBooking.start,
              endTime: conflictingBooking.end,
              status: conflictingBooking.status,
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
