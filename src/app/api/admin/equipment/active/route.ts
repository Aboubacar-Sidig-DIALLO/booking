import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Récupérer seulement les équipements actifs
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

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

    // Récupérer les équipements actifs globalement ET activés pour cette organisation
    const features = await prisma.feature.findMany({
      where: {
        isActive: true, // Actif globalement
      },
      include: {
        organizations: {
          where: { organizationId: user.org.id, isEnabled: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Filtrer pour ne garder que ceux qui sont activés pour cette organisation
    const equipment = features
      .filter((feature) => feature.organizations.length > 0)
      .map((feature) => ({
        id: feature.id,
        name: feature.name,
        icon: feature.icon,
        description: feature.description,
        howToUse: feature.howToUse,
        isActive: feature.isActive,
      }));

    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du chargement des équipements actifs:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des équipements actifs" },
      { status: 500 }
    );
  }
}
