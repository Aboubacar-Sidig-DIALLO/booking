import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/favorites - Récupérer tous les favoris de l'utilisateur connecté
export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      select: {
        roomId: true,
      },
    });

    const roomIds = favorites.map((f) => f.roomId);
    return NextResponse.json({ roomIds });
  } catch (error: any) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Ajouter un favori
export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    // Vérifier que la salle existe
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Créer le favori (utiliser upsert pour éviter les doublons)
    await prisma.favorite.upsert({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: roomId,
        },
      },
      update: {},
      create: {
        userId: userId,
        roomId: roomId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Retirer un favori
export async function DELETE(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    await prisma.favorite
      .delete({
        where: {
          userId_roomId: {
            userId: userId,
            roomId: roomId,
          },
        },
      })
      .catch((error: any) => {
        // Si le favori n'existe pas, c'est OK (idempotent)
        if (error.code !== "P2025") {
          throw error;
        }
      });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
