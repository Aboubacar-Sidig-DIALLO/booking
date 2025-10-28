import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateBookingSchema = z.object({
  roomId: z.string().min(1, "La salle est requise").optional(),
  title: z.string().min(1, "Le titre est requis").optional(),
  description: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  privacy: z.enum(["ORG", "PUBLIC", "PRIVATE"]).optional(),
  participants: z.array(z.string()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

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

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            capacity: true,
            location: true,
            floor: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la réservation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

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

    const body = await req.json();
    const data = updateBookingSchema.parse(body);

    // Récupérer la réservation actuelle
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    const roomId = data.roomId || existingBooking.roomId;
    const start = data.start ? new Date(data.start) : existingBooking.start;
    const end = data.end ? new Date(data.end) : existingBooking.end;

    // Vérifier les conflits si la salle ou les horaires ont changé
    if (data.roomId || data.start || data.end) {
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          roomId,
          id: { not: params.id },
          status: "CONFIRMED",
          OR: [
            {
              start: {
                lte: end,
              },
              end: {
                gte: start,
              },
            },
          ],
        },
      });

      if (conflictingBookings.length > 0) {
        return NextResponse.json(
          {
            error: "Conflit de réservation",
            details: "Cette salle est déjà réservée pendant cette période.",
          },
          { status: 409 }
        );
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (data.roomId) updateData.roomId = data.roomId;
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.start) updateData.start = start;
    if (data.end) updateData.end = end;
    if (data.privacy) updateData.privacy = data.privacy;

    // Mettre à jour la réservation
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            capacity: true,
            location: true,
            floor: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // TODO: Envoyer un email et une notification à l'utilisateur
    // await sendBookingUpdateEmail(booking.createdBy.email, booking);
    // await createNotification(booking.createdById, "Votre réservation a été modifiée");

    return NextResponse.json(booking, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la modification de la réservation:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la modification de la réservation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionUser = session.user as any;

    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer la réservation avant suppression pour envoyer l'email
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            email: true,
            name: true,
          },
        },
        room: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    // Supprimer les participants
    await prisma.bookingParticipant.deleteMany({
      where: { bookingId: params.id },
    });

    // Supprimer la réservation
    await prisma.booking.delete({
      where: { id: params.id },
    });

    // TODO: Envoyer un email et une notification à l'utilisateur
    // await sendBookingCancelledEmail(booking.createdBy.email, booking);
    // await createNotification(booking.createdById, "Votre réservation a été annulée");

    return NextResponse.json(
      { message: "Réservation annulée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de la réservation" },
      { status: 500 }
    );
  }
}
