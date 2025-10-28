import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookingSchema = z.object({
  roomId: z.string().min(1, "La salle est requise"),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  privacy: z.enum(["ORG", "PUBLIC", "PRIVATE"]).default("ORG"),
  participants: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {
      orgId: user.org.id,
    };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
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
      orderBy: {
        start: "desc",
      },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const data = bookingSchema.parse(body);

    // Vérifier les conflits
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId: data.roomId,
        status: "CONFIRMED",
        OR: [
          {
            start: {
              lte: new Date(data.end),
            },
            end: {
              gte: new Date(data.start),
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

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        orgId: user.org.id,
        roomId: data.roomId,
        title: data.title,
        description: data.description,
        start: new Date(data.start),
        end: new Date(data.end),
        privacy: data.privacy,
        status: "CONFIRMED",
        createdById: user.id,
      },
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

    // Ajouter les participants si fournis
    if (data.participants && data.participants.length > 0) {
      await prisma.bookingParticipant.createMany({
        data: data.participants.map((userId: string) => ({
          bookingId: booking.id,
          userId,
          role: "OPTIONAL",
        })),
      });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de la création de la réservation:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la réservation" },
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

    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de réservation requis" },
        { status: 400 }
      );
    }

    // Supprimer les participants
    await prisma.bookingParticipant.deleteMany({
      where: { bookingId: id },
    });

    // Supprimer la réservation
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Réservation supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la réservation" },
      { status: 500 }
    );
  }
}
