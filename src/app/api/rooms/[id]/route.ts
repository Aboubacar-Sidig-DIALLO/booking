import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/rooms/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomId } = await params;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        features: {
          include: {
            feature: true,
          },
        },
        site: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Salle non trouvée" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Erreur lors de la récupération de la salle:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
