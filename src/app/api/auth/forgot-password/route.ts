import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email-service";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Format d'email invalide - Vérifiez votre saisie")
    .max(254, "L'adresse email est trop longue")
    .refine((email) => {
      // Validation supplémentaire pour éviter les emails malformés
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, "Format d'email invalide - Utilisez un format valide (ex: nom@domaine.com)"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      include: { org: true },
    });

    if (!user) {
      // Email non trouvé - retourner une erreur spécifique
      return NextResponse.json(
        {
          error: "Cette adresse email n'est pas enregistrée dans notre système",
          code: "EMAIL_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Sauvegarder le token dans la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Envoyer l'email de réinitialisation
    try {
      await sendPasswordResetEmail({
        to: user.email,
        userName: user.name || "Utilisateur",
        companyName: user.org.name,
        resetUrl: `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`,
      });

      console.log(`Email de réinitialisation envoyé à ${user.email}`);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // En développement, on log le token pour faciliter les tests
      if (process.env.NODE_ENV === "development") {
        console.log("=".repeat(60));
        console.log("🔑 TOKEN DE RÉINITIALISATION (DÉVELOPPEMENT)");
        console.log("=".repeat(60));
        console.log(`📧 Email: ${user.email}`);
        console.log(`🏢 Entreprise: ${user.org.name}`);
        console.log(`🔑 Token: ${resetToken}`);
        console.log(
          `🔗 URL: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
        );
        console.log("=".repeat(60));
      }
    }

    return NextResponse.json(
      {
        message: "Un email de réinitialisation a été envoyé à votre adresse",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);

    if (error instanceof z.ZodError) {
      // Extraire le message d'erreur spécifique pour l'email
      const emailError = error.errors.find((err) => err.path.includes("email"));
      const errorMessage = emailError?.message || "Format d'email invalide";

      return NextResponse.json(
        {
          error: errorMessage,
          code: "INVALID_EMAIL_FORMAT",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la demande de réinitialisation",
      },
      { status: 500 }
    );
  }
}
