import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

// Exemple d'utilisation du middleware d'authentification
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, token) => {
    try {
      // Le token contient les informations de l'utilisateur connecté
      const userId = token.sub;

      // Récupérer les données de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      return NextResponse.json(
        { error: "Erreur interne du serveur" },
        { status: 500 }
      );
    }
  });
}
