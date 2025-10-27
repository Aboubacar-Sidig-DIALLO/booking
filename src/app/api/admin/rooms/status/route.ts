import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.error("No session user");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Vérifier si l'utilisateur est admin
    if (sessionUser.role !== "ADMIN") {
      console.error("Not admin:", sessionUser.role);
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer l'organization de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: { org: true },
    });

    if (!user || !user.org) {
      console.error("No user or org:", { user: !!user, org: !!user?.org });
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 404 }
      );
    }

    const orgId = user.org.id;
    console.log("Fetching rooms for orgId:", orgId);

    // Récupérer toutes les salles
    const rooms = await prisma.room.findMany({
      where: { orgId },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            orgId: true,
          },
        },
        features: {
          include: {
            feature: true,
          },
        },
        bookings: {
          where: {
            status: "CONFIRMED",
            start: {
              lte: new Date(),
            },
            end: {
              gte: new Date(),
            },
          },
          orderBy: {
            start: "asc",
          },
          take: 1,
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log("Fetched rooms count:", rooms.length);

    // Transformer les données pour inclure les informations de status
    const roomsWithStatus = rooms.map((room) => {
      const activeBooking = room.bookings[0];
      const isOccupied = activeBooking !== undefined;
      const isMaintenance = !room.isActive;

      // Calculer le temps restant si occupée
      let timeRemaining = null;
      if (activeBooking) {
        const now = new Date();
        const endTime = new Date(activeBooking.end);
        const diff = endTime.getTime() - now.getTime();

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          timeRemaining = { hours, minutes };
        }
      }

      return {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        description: room.description,
        isActive: room.isActive,
        status: room.isActive ? "active" : "inactive",
        isOccupied,
        isMaintenance,
        features: room.features.map((rf) => rf.feature.name),
        equipment: room.features.map((rf) => rf.feature.name), // Alias pour compatibilité
        currentBooking: activeBooking
          ? {
              id: activeBooking.id,
              title: activeBooking.title,
              start: activeBooking.start.toISOString(),
              end: activeBooking.end.toISOString(),
              createdBy: activeBooking.createdBy
                ? {
                    name: activeBooking.createdBy.name,
                    email: activeBooking.createdBy.email,
                  }
                : null,
              participants: activeBooking.participants.map((p) => ({
                user: {
                  name: p.user.name,
                  email: p.user.email,
                },
              })),
              timeRemaining,
            }
          : null,
        site: room.site,
      };
    });

    console.log("Successfully fetched rooms:", roomsWithStatus.length);

    return NextResponse.json(roomsWithStatus, { status: 200 });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du statut des salles:",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur lors de la récupération du statut des salles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
