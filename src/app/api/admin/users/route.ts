import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const UserSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.enum(["admin", "manager", "user"]),
  department: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  notes: z.string().optional(),
});

// Fonction pour convertir le rôle du formulaire vers le format Prisma
const convertRoleToPrisma = (
  role: string
): "ADMIN" | "MANAGER" | "EMPLOYEE" | "VIEWER" => {
  switch (role.toLowerCase()) {
    case "admin":
      return "ADMIN";
    case "manager":
      return "MANAGER";
    case "user":
      return "EMPLOYEE";
    default:
      return "VIEWER";
  }
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier si l'utilisateur est admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = UserSchema.parse(body);

    // Récupérer l'organization de l'utilisateur admin
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { org: true },
    });

    if (!adminUser || !adminUser.org) {
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 404 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Générer un mot de passe temporaire
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        role: convertRoleToPrisma(validatedData.role),
        department: validatedData.department || null,
        phone: validatedData.phone || null,
        location: validatedData.location || null,
        status: validatedData.status || "active",
        notes: validatedData.notes || null,
        orgId: adminUser.org.id,
        mustChangePassword: true, // Forcer le changement de mot de passe à la première connexion
      },
    });

    return NextResponse.json(
      {
        ...user,
        temporaryPassword, // À envoyer par email ou autre moyen sécurisé
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    // Retourner le message d'erreur détaillé
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur lors de la création de l'utilisateur";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier si l'utilisateur est admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer l'organization de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { org: true },
    });

    if (!user || !user.org) {
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 404 }
      );
    }

    // Récupérer tous les utilisateurs de l'organisation SAUF l'admin connecté
    const users = await prisma.user.findMany({
      where: {
        orgId: user.org.id,
        id: { not: session.user.id }, // Exclure l'admin connecté
      },
      include: {
        bookings: {
          include: {
            booking: true,
          },
        },
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);

    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
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

    // Vérifier si l'utilisateur est admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...validatedData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID d'utilisateur requis" },
        { status: 400 }
      );
    }

    const validatedUserData = UserSchema.parse(validatedData);

    // Récupérer l'organization de l'utilisateur
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { org: true },
    });

    if (!adminUser || !adminUser.org) {
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur appartient à l'organisation
    const existingUser = await prisma.user.findFirst({
      where: {
        id: id,
        orgId: adminUser.org.id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
      where: { id: id },
      data: {
        name: validatedUserData.name,
        email: validatedUserData.email,
        role: convertRoleToPrisma(validatedUserData.role),
        department: validatedUserData.department || null,
        phone: validatedUserData.phone || null,
        location: validatedUserData.location || null,
        status: validatedUserData.status || "active",
        notes: validatedUserData.notes || null,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur" },
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

    // Vérifier si l'utilisateur est admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID d'utilisateur requis" },
        { status: 400 }
      );
    }

    // Empêcher la suppression de l'utilisateur actuel
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      );
    }

    // Récupérer l'organization de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { org: true },
    });

    if (!user || !user.org) {
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur appartient à l'organisation
    const existingUser = await prisma.user.findFirst({
      where: {
        id: id,
        orgId: user.org.id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Utilisateur supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);

    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}
