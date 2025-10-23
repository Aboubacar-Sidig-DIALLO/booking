import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password-utils";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import { z } from "zod";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// POST /api/user/change-password
export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(
        "UNAUTHORIZED",
        401,
        "Vous devez être connecté pour changer votre mot de passe"
      );
    }

    const body = await req.json();
    const validatedData = ChangePasswordSchema.parse(body);

    // Récupérer l'utilisateur avec son mot de passe actuel
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return createErrorResponse(
        "USER_NOT_FOUND",
        404,
        "Utilisateur non trouvé ou pas de mot de passe défini"
      );
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return createErrorResponse(
        "INVALID_CURRENT_PASSWORD",
        400,
        "Le mot de passe actuel est incorrect"
      );
    }

    // Hacher le nouveau mot de passe
    const hashedNewPassword = await hashPassword(validatedData.newPassword);

    // Mettre à jour le mot de passe et marquer qu'il a été changé
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedNewPassword,
        mustChangePassword: false, // Plus besoin de changer le mot de passe
        passwordChangedAt: new Date(),
      },
    });

    return createSuccessResponse(
      { success: true },
      "Mot de passe changé avec succès"
    );
  } catch (error: any) {
    console.error("Erreur lors du changement de mot de passe:", error);

    if (error.name === "ZodError") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        400,
        "Données d'entrée invalides",
        { errors: error.errors }
      );
    }

    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      500,
      "Erreur lors du changement de mot de passe"
    );
  }
};
