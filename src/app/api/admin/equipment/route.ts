import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const EquipmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  icon: z.string().optional(),
  howToUse: z.string().optional(),
});

// GET - Récupérer tous les équipements
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Seuls ROI et ADMIN peuvent voir les équipements
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

    // Récupérer tous les équipements avec leur statut pour cette organisation
    const features = await prisma.feature.findMany({
      include: {
        organizations: {
          where: { organizationId: user.org.id },
        },
      },
      orderBy: { name: "asc" },
    });

    // Mapper les résultats pour inclure le statut spécifique à l'organisation
    const equipment = features.map((feature: any) => ({
      id: feature.id,
      name: feature.name,
      icon: feature.icon,
      description: feature.description,
      howToUse: feature.howToUse,
      isActive: feature.isActive, // Statut global du feature
      isEnabled: feature.organizations[0]?.isEnabled ?? false, // Statut pour cette organisation
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    }));

    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du chargement des équipements:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des équipements" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel équipement
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Seul ROI peut créer des équipements
    if (sessionUser.role !== "ROI") {
      return NextResponse.json(
        {
          error:
            "Accès refusé - Seul le Super Admin peut créer des équipements",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = EquipmentSchema.parse(body);

    // Vérifier si l'équipement existe déjà
    const existing = await prisma.feature.findUnique({
      where: { name: validatedData.name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Cet équipement existe déjà" },
        { status: 400 }
      );
    }

    // Créer l'équipement
    const equipment = await prisma.feature.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        icon: validatedData.icon || null,
        howToUse: validatedData.howToUse || null,
        isActive: true,
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'équipement:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la création de l'équipement" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un équipement
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Seul ROI peut modifier des équipements
    if (sessionUser.role !== "ROI") {
      return NextResponse.json(
        {
          error:
            "Accès refusé - Seul le Super Admin peut modifier des équipements",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ...validatedData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID d'équipement requis" },
        { status: 400 }
      );
    }

    const validatedUpdate = EquipmentSchema.partial().parse(validatedData);

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

    // Vérifier si le nouveau nom existe déjà (si le nom est modifié)
    if (validatedData.name && validatedData.name !== existing.name) {
      const nameExists = await prisma.feature.findUnique({
        where: { name: validatedData.name },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Ce nom d'équipement existe déjà" },
          { status: 400 }
        );
      }
    }

    const equipment = await prisma.feature.update({
      where: { id },
      data: validatedUpdate,
    });

    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'équipement:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'équipement" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un équipement
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    // Seul ROI peut supprimer des équipements
    if (sessionUser.role !== "ROI") {
      return NextResponse.json(
        {
          error:
            "Accès refusé - Seul le Super Admin peut supprimer des équipements",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID d'équipement requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'équipement existe
    const existing = await prisma.feature.findUnique({
      where: { id },
      include: {
        rooms: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Équipement introuvable" },
        { status: 404 }
      );
    }

    // Vérifier si l'équipement est utilisé
    if (existing.rooms.length > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer cet équipement car il est utilisé par certaines salles",
        },
        { status: 400 }
      );
    }

    await prisma.feature.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Équipement supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'équipement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'équipement" },
      { status: 500 }
    );
  }
}
