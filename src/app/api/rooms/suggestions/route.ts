import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { capacity, start, end, siteId } = await req.json();

  if (!start || !end || !capacity) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // Récupérer toutes les salles actives avec leurs caractéristiques
  const rooms = await prisma.room.findMany({
    where: {
      isActive: true,
      ...(siteId ? { siteId } : {}),
    },
    include: {
      features: {
        include: {
          feature: true,
        },
      },
      site: true,
      bookings: {
        where: {
          AND: [
            {
              OR: [
                {
                  AND: [
                    { start: { lte: startDate } },
                    { end: { gt: startDate } },
                  ],
                },
                {
                  AND: [{ start: { lt: endDate } }, { end: { gte: endDate } }],
                },
                {
                  AND: [
                    { start: { gte: startDate } },
                    { end: { lte: endDate } },
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
        select: { id: true, title: true, start: true, end: true, status: true },
      },
    },
    orderBy: { capacity: "asc" },
  });

  // Simuler des salles occupées pour démonstration (EXACTEMENT la même logique que l'API availability)
  const simulatedOccupiedRooms = [
    "Salle Alpha", // Simuler comme occupée
    "Salle Beta", // Simuler comme occupée
    "Salle Gamma", // Simuler comme occupée
  ];

  const simulatedBookings = [
    {
      title: "Réunion équipe Marketing",
      start: new Date(startDate.getTime() - 30 * 60 * 1000), // 30 min avant
      end: new Date(endDate.getTime() + 30 * 60 * 1000), // 30 min après
      status: "CONFIRMED",
    },
    {
      title: "Formation développeurs",
      start: new Date(startDate.getTime() + 15 * 60 * 1000), // 15 min après le début
      end: new Date(endDate.getTime() - 15 * 60 * 1000), // 15 min avant la fin
      status: "CONFIRMED",
    },
    {
      title: "Entretien candidat",
      start: new Date(startDate.getTime() - 60 * 60 * 1000), // 1h avant
      end: new Date(startDate.getTime() + 15 * 60 * 1000), // 15 min après le début
      status: "PENDING",
    },
    {
      title: "Présentation client",
      start: new Date(endDate.getTime() - 45 * 60 * 1000), // 45 min avant la fin
      end: new Date(endDate.getTime() + 60 * 60 * 1000), // 1h après
      status: "CONFIRMED",
    },
  ];

  // Filtrer et scorer les salles - SEULEMENT LES SALLES DISPONIBLES
  const suggestions = rooms
    .filter((room: any, index: number) => {
      // Vérifier les réservations réelles dans la base de données
      const hasRealBooking = room.bookings && room.bookings.length > 0;

      // Simuler des occupations pour certaines salles (MÊME LOGIQUE que l'API availability)
      const shouldSimulateOccupied =
        simulatedOccupiedRooms.includes(room.name) ||
        (index % 3 === 0 && index < simulatedBookings.length);

      // STRICTEMENT : La salle doit être complètement disponible
      const isAvailable = !hasRealBooking && !shouldSimulateOccupied;

      return isAvailable;
    }) // FILTRAGE STRICT : Seulement les salles 100% disponibles
    .map((room) => {
      let matchScore = 0;

      // Score basé sur la capacité (plus important)
      if (room.capacity >= capacity) {
        if (room.capacity <= capacity * 1.2) {
          matchScore += 50; // Taille parfaite
        } else if (room.capacity <= capacity * 1.5) {
          matchScore += 35; // Légèrement trop grande
        } else {
          matchScore += 20; // Trop grande
        }
      }

      // Bonus pour les équipements utiles
      const hasWifi = room.features.some((rf) =>
        rf.feature.name.toLowerCase().includes("wifi")
      );
      const hasScreen = room.features.some(
        (rf) =>
          rf.feature.name.toLowerCase().includes("écran") ||
          rf.feature.name.toLowerCase().includes("monitor")
      );

      if (hasWifi) matchScore += 15;
      if (hasScreen) matchScore += 15;

      // Bonus pour les salles de taille appropriée
      if (capacity <= 4 && room.capacity <= 8) matchScore += 10;
      if (
        capacity > 4 &&
        capacity <= 12 &&
        room.capacity >= 8 &&
        room.capacity <= 16
      )
        matchScore += 10;
      if (capacity > 12 && room.capacity >= 16) matchScore += 10;

      return {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        features: room.features,
        site: room.site,
        available: true, // Garanti disponible car déjà filtré
        matchScore: Math.min(100, matchScore),
      };
    })
    .filter((room) => room.matchScore > 0 && room.available === true) // Double vérification
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10); // Plus de suggestions pour avoir plus de choix après filtrage

  // Vérification finale : s'assurer qu'aucune salle occupée n'est dans les suggestions
  const finalSuggestions = suggestions.filter((suggestion) => {
    const originalRoom = rooms.find((r) => r.id === suggestion.id);
    const originalIndex = rooms.findIndex((r) => r.id === suggestion.id);
    const hasBooking =
      originalRoom?.bookings && originalRoom.bookings.length > 0;

    // Utiliser la même logique de simulation que le filtrage principal
    const shouldSimulateOccupied =
      simulatedOccupiedRooms.includes(suggestion.name) ||
      (originalIndex % 3 === 0 && originalIndex < simulatedBookings.length);

    const isOccupied = hasBooking || shouldSimulateOccupied;

    // Exclure les salles occupées (réservations réelles ou simulées)
    return !isOccupied;
  });

  return NextResponse.json({
    rooms: finalSuggestions,
    debug: {
      totalRoomsChecked: rooms.length,
      availableRooms: rooms.filter(
        (r) => !r.bookings?.length && !simulatedOccupiedRooms.includes(r.name)
      ).length,
      suggestionsReturned: finalSuggestions.length,
      simulatedOccupiedRooms: simulatedOccupiedRooms,
    },
  });
}
