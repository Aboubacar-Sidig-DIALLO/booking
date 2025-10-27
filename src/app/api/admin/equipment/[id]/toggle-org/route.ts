import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Seuls ADMIN et ROI peuvent activer/désactiver des équipements pour leur organisation
    if (sessionUser.role !== "ADMIN" && sessionUser.role !== "ROI") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer l'organisation de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email },
      include: { org: true },
    });

    if (!user?.org) {
      return NextResponse.json(
        { error: "Organisation non trouvée" },
        { status: 404 }
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

    const featureId = pathParts[idIndex + 1];

    // Vérifier si l'équipement existe et est actif globalement
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
    });

    if (!feature) {
      return NextResponse.json(
        { error: "Équipement introuvable" },
        { status: 404 }
      );
    }

    if (!feature.isActive) {
      return NextResponse.json(
        { error: "Cet équipement n'est pas disponible" },
        { status: 400 }
      );
    }

    // Vérifier si la relation OrganizationFeature existe
    const existingRelation = await prisma.organizationFeature.findUnique({
      where: {
        organizationId_featureId: {
          organizationId: user.org.id,
          featureId: featureId,
        },
      },
    });

    let result;
    if (existingRelation) {
      // Mettre à jour le statut existant
      const newEnabledState = !existingRelation.isEnabled;
      result = await prisma.organizationFeature.update({
        where: {
          organizationId_featureId: {
            organizationId: user.org.id,
            featureId: featureId,
          },
        },
        data: {
          isEnabled: newEnabledState,
        },
      });
    } else {
      // Créer la relation avec isEnabled = true par défaut
      result = await prisma.organizationFeature.create({
        data: {
          organizationId: user.org.id,
          featureId: featureId,
          isEnabled: true,
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
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
