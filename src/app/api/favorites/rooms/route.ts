import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/favorites/rooms - Récupérer toutes les salles favorites avec leurs détails
export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    // Récupérer les favoris de l'utilisateur avec les détails des salles
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      include: {
        room: {
          include: {
            features: {
              include: {
                feature: true,
              },
            },
            site: true,
          },
        },
      },
    });

    // Transformer les données pour correspondre au format attendu
    const rooms = favorites.map((fav) => ({
      id: fav.room.id,
      name: fav.room.name,
      capacity: fav.room.capacity,
      equipment: fav.room.features.map((f) => f.feature.name),
      status: "disponible", // TODO: calculer le statut réel basé sur les réservations
      location: fav.room.location || fav.room.site?.name || "",
      type: "réunion", // Par défaut
      description: fav.room.description || "",
      site: fav.room.site,
    }));

    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error("Error fetching favorite rooms:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
