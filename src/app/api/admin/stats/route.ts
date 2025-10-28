import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Vérifier si l'utilisateur est admin
    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer l'organization de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: { org: true },
    });

    if (!user || !user.org) {
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 404 }
      );
    }

    const orgId = user.org.id;

    // Récupérer toutes les statistiques en parallèle
    const [
      totalRooms,
      activeRooms,
      maintenanceRooms,
      totalUsers,
      activeUsers,
      inactiveUsers,
      pendingUsers,
      activeBookings,
    ] = await Promise.all([
      // Total de salles
      prisma.room.count({
        where: { orgId },
      }),
      // Salles actives
      prisma.room.count({
        where: {
          orgId,
          isActive: true,
        },
      }),
      // Salles en maintenance
      prisma.room.count({
        where: {
          orgId,
          isActive: false,
        },
      }),
      // Total d'utilisateurs (exclure l'admin courant)
      prisma.user.count({
        where: {
          orgId,
          id: {
            not: sessionUser.id,
          },
        },
      }),
      // Utilisateurs actifs (exclure l'admin courant)
      prisma.user.count({
        where: {
          orgId,
          status: "active",
          id: {
            not: sessionUser.id,
          },
        },
      }),
      // Utilisateurs non actifs (exclure l'admin courant)
      prisma.user.count({
        where: {
          orgId,
          status: {
            not: "active",
          },
          id: {
            not: sessionUser.id,
          },
        },
      }),
      // Utilisateurs en attente (exclure l'admin courant)
      prisma.user.count({
        where: {
          orgId,
          status: "pending",
          id: {
            not: sessionUser.id,
          },
        },
      }),
      // Réservations actives (jusqu'à aujourd'hui)
      prisma.booking.count({
        where: {
          orgId,
          status: "CONFIRMED",
          start: {
            lte: new Date(), // Aujourd'hui ou avant
          },
          end: {
            gte: new Date(), // Aujourd'hui ou après
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        totalRooms,
        activeRooms,
        maintenanceRooms,
        totalUsers,
        activeUsers,
        inactiveUsers,
        pendingUsers,
        activeBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);

    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
