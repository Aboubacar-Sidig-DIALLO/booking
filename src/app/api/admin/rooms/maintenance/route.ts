import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MaintenanceSchema = z.object({
  roomId: z.string().min(1, "ID de salle requis"),
  startImmediately: z.boolean(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  reason: z.string().min(1, "La raison est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
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
    const validatedData = MaintenanceSchema.parse(body);

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
    const room = await prisma.room.findFirst({
      where: {
        id: validatedData.roomId,
        orgId: user.org.id,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    // Créer les dates de maintenance
    const endDateTime = new Date(
      `${validatedData.endDate}T${validatedData.endTime}`
    );

    const startDateTime = validatedData.startImmediately
      ? new Date() // Maintenance immédiate
      : new Date(`${validatedData.startDate}T${validatedData.startTime}`);

    // Construire la description de maintenance
    const maintenanceDesc = validatedData.startImmediately
      ? `[Maintenance immédiate] ${validatedData.reason} - Jusqu'au ${validatedData.endDate} à ${validatedData.endTime}`
      : `[Maintenance planifiée] ${validatedData.reason} - Du ${validatedData.startDate} ${validatedData.startTime} au ${validatedData.endDate} à ${validatedData.endTime}`;

    // Si la maintenance est immédiate, mettre à jour immédiatement
    if (validatedData.startImmediately) {
      // Mettre à jour le statut de la salle immédiatement
      const updatedRoom = await prisma.room.update({
        where: { id: validatedData.roomId },
        data: {
          isActive: false,
          description: room.description
            ? `${room.description}\n\n${maintenanceDesc}`
            : maintenanceDesc,
        },
      });

      // Annuler toutes les réservations futures pour cette salle
      await prisma.booking.updateMany({
        where: {
          roomId: validatedData.roomId,
          start: {
            gt: new Date(), // Réservations à partir de maintenant
          },
        },
        data: {
          status: "CANCELLED",
        },
      });

      return NextResponse.json(
        {
          message: "Salle mise en maintenance immédiatement",
          room: updatedRoom,
        },
        { status: 200 }
      );
    } else {
      // Pour une maintenance planifiée, on stocke l'information
      const updatedRoom = await prisma.room.update({
        where: { id: validatedData.roomId },
        data: {
          // On ne désactive pas immédiatement pour permettre les réservations jusqu'au début
          description: room.description
            ? `${room.description}\n\n${maintenanceDesc}`
            : maintenanceDesc,
        },
      });

      return NextResponse.json(
        {
          message: "Maintenance planifiée avec succès",
          room: updatedRoom,
          scheduledStart: startDateTime,
          scheduledEnd: endDateTime,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise en maintenance:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise en maintenance" },
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
    const roomId = searchParams.get("roomId");

    if (!roomId) {
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
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        orgId: user.org.id,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    // Réactiver la salle et nettoyer la description
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        isActive: true,
        description: room.description
          ? room.description
              .split("\n\n")
              .filter((line) => !line.includes("[Maintenance"))
              .join("\n\n")
          : null,
      },
    });

    return NextResponse.json(
      {
        message: "Maintenance annulée",
        room: updatedRoom,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'annulation de la maintenance:", error);

    return NextResponse.json(
      { error: "Erreur lors de l'annulation de la maintenance" },
      { status: 500 }
    );
  }
}
