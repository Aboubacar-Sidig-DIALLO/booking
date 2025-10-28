import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Récupérer la réservation avant suppression
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

    // Marquer la réservation comme annulée au lieu de la supprimer
    await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: "CANCELLED",
      },
    });

    // TODO: Envoyer un email et une notification à l'utilisateur
    // await sendBookingCancelledEmail(booking.createdBy.email, booking);

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
