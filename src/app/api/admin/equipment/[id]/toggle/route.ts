import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  console.log("🔵 PATCH /api/admin/equipment/[id]/toggle called");

  try {
    console.log("🔵 Checking session...");
    const session = await getServerSession(authOptions);
    console.log("🔵 Session:", !!session, session?.user);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Seul ROI peut activer/désactiver des équipements
    if (sessionUser.role !== "ROI") {
      return NextResponse.json(
        {
          error:
            "Accès refusé - Seul le Super Admin peut activer/désactiver des équipements",
        },
        { status: 403 }
      );
    }

    // Extraire l'ID de l'URL
    const url = req.url;
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const idIndex = pathParts.indexOf("equipment");

    if (idIndex === -1 || idIndex + 1 >= pathParts.length) {
      return NextResponse.json({ error: "ID introuvable" }, { status: 400 });
    }

    const id = pathParts[idIndex + 1];

    console.log("Equipment ID extracted:", id);

    // Vérifier si l'équipement existe
    const existing = await prisma.feature.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Équipement introuvable" },
        { status: 404 }
      );
    }

    console.log("Existing equipment:", existing);
    console.log("IsActive:", existing.isActive);

    // Définir isActive à false si undefined/null, sinon inverser
    const newActiveState =
      existing.isActive === undefined || existing.isActive === null
        ? false
        : !existing.isActive;

    // Mettre à jour le statut
    const equipment = await prisma.feature.update({
      where: { id },
      data: {
        isActive: newActiveState,
      },
    });

    console.log("Equipment updated:", equipment);

    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour du statut",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
