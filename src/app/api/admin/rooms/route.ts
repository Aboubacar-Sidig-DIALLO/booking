import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RoomSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  capacity: z.number().min(1, "La capacité doit être supérieure à 0"),
  status: z.enum(["active", "inactive", "maintenance"]),
  location: z.string().optional(),
  description: z.string().optional(),
  equipment: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const validatedData = RoomSchema.parse(body);

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

    // Créer ou récupérer un site par défaut
    let site = await prisma.site.findFirst({
      where: { orgId: user.org.id },
    });

    if (!site) {
      site = await prisma.site.create({
        data: {
          name: "Site principal",
          orgId: user.org.id,
        },
      });
    }

    // Créer la salle
    const room = await prisma.room.create({
      data: {
        orgId: user.org.id,
        siteId: site.id,
        name: validatedData.name,
        slug: validatedData.name.toLowerCase().replace(/\s+/g, "-"),
        capacity: validatedData.capacity,
        location: validatedData.location || null,
        description: validatedData.description || null,
        isActive: validatedData.status === "active",
      },
    });

    // Gérer les équipements (features)
    if (
      validatedData.equipment &&
      Array.isArray(validatedData.equipment) &&
      validatedData.equipment.length > 0
    ) {
      // Créer ou récupérer les features
      const featurePromises = validatedData.equipment.map(
        async (eqName: string) => {
          // Vérifier si la feature existe
          let feature = await prisma.feature.findUnique({
            where: { name: eqName },
          });

          // Si elle n'existe pas, la créer
          if (!feature) {
            feature = await prisma.feature.create({
              data: { name: eqName },
            });
          }

          // Créer la relation RoomFeature
          return prisma.roomFeature.create({
            data: {
              roomId: room.id,
              featureId: feature.id,
            },
          });
        }
      );

      await Promise.all(featurePromises);
    }

    // Récupérer la salle créée avec ses features
    const createdRoom = await prisma.room.findUnique({
      where: { id: room.id },
      include: {
        site: true,
        features: {
          include: {
            feature: true,
          },
        },
      },
    });

    return NextResponse.json(createdRoom, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la salle:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la salle" },
      { status: 500 }
    );
  }
}

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

    // Récupérer toutes les salles de l'organisation
    const rooms = await prisma.room.findMany({
      where: { orgId: user.org.id },
      include: {
        site: true,
        features: {
          include: {
            feature: true,
          },
        },
        bookings: true,
      },
    });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);

    return NextResponse.json(
      { error: "Erreur lors de la récupération des salles" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { id, ...validatedData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID de salle requis" },
        { status: 400 }
      );
    }

    const validatedRoomData = RoomSchema.parse(validatedData);

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

    // Vérifier que la salle appartient à l'organisation
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: id,
        orgId: user.org.id,
      },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    // Mettre à jour la salle
    const room = await prisma.room.update({
      where: { id: id },
      data: {
        name: validatedRoomData.name,
        slug: validatedRoomData.name.toLowerCase().replace(/\s+/g, "-"),
        capacity: validatedRoomData.capacity,
        location: validatedRoomData.location || null,
        description: validatedRoomData.description || null,
        isActive: validatedRoomData.status === "active",
      },
    });

    // Gérer les équipements (features)
    if (validatedData.equipment && Array.isArray(validatedData.equipment)) {
      // Supprimer toutes les features existantes de cette salle
      await prisma.roomFeature.deleteMany({
        where: { roomId: id },
      });

      // Ajouter les nouvelles features
      if (validatedData.equipment.length > 0) {
        // Créer ou récupérer les features
        const featurePromises = validatedData.equipment.map(
          async (eqName: string) => {
            // Vérifier si la feature existe
            let feature = await prisma.feature.findUnique({
              where: { name: eqName },
            });

            // Si elle n'existe pas, la créer
            if (!feature) {
              feature = await prisma.feature.create({
                data: { name: eqName },
              });
            }

            // Créer la relation RoomFeature
            return prisma.roomFeature.create({
              data: {
                roomId: id,
                featureId: feature.id,
              },
            });
          }
        );

        await Promise.all(featurePromises);
      }
    }

    // Récupérer la salle mise à jour avec ses features
    const updatedRoom = await prisma.room.findUnique({
      where: { id: id },
      include: {
        site: true,
        features: {
          include: {
            feature: true,
          },
        },
      },
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la salle:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la salle" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de salle requis" },
        { status: 400 }
      );
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

    // Vérifier que la salle appartient à l'organisation
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: id,
        orgId: user.org.id,
      },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    // Supprimer la salle
    await prisma.room.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Salle supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la salle:", error);

    return NextResponse.json(
      { error: "Erreur lors de la suppression de la salle" },
      { status: 500 }
    );
  }
}
