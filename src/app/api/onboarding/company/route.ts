import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const companyOnboardingSchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis"),
  address: z.string().optional(),
  phone: z.string().optional(),
  contactEmail: z.string().email("Email de contact invalide").optional(),
  industry: z.string().optional(),
  employeeCount: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = companyOnboardingSchema.parse(body);

    // Vérifier si l'utilisateur a déjà une organisation
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { org: true },
    });

    if (existingUser?.org) {
      return NextResponse.json(
        { error: "L'utilisateur a déjà une organisation" },
        { status: 400 }
      );
    }

    // Créer l'organisation et mettre à jour l'utilisateur
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'organisation
      const organization = await tx.organization.create({
        data: {
          name: validatedData.name,
          address: validatedData.address,
          phone: validatedData.phone,
          contactEmail: validatedData.contactEmail,
          industry: validatedData.industry,
          employeeCount: validatedData.employeeCount,
          onboardingCompletedAt: new Date(),
        },
      });

      // Mettre à jour l'utilisateur pour le lier à l'organisation et le promouvoir admin
      const updatedUser = await tx.user.update({
        where: { email: session.user.email },
        data: {
          orgId: organization.id,
          role: "ADMIN",
        },
      });

      return { organization, user: updatedUser };
    });

    return NextResponse.json({
      success: true,
      organization: result.organization,
      user: result.user,
    });
  } catch (error) {
    console.error("Erreur lors de l'onboarding entreprise:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
