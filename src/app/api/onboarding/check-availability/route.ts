import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";

// GET /api/onboarding/check-availability
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const field = searchParams.get("field");
    const value = searchParams.get("value");

    if (!field || !value) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        400,
        "Les paramètres 'field' et 'value' sont requis"
      );
    }

    if (!["companyName", "companySlug"].includes(field)) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        400,
        "Le champ doit être 'companyName' ou 'companySlug'"
      );
    }

    if (value.length < 2) {
      return createSuccessResponse({
        available: true,
        message: "Valeur trop courte pour vérifier",
      });
    }

    let existingRecord = null;

    if (field === "companyName") {
      // Vérifier si le nom d'entreprise existe déjà
      existingRecord = await prisma.organization.findFirst({
        where: {
          name: {
            equals: value,
            mode: "insensitive",
          },
        },
      });
    } else if (field === "companySlug") {
      // Vérifier si le slug existe déjà
      const slugValue = value.toLowerCase();
      existingRecord = await prisma.organization.findUnique({
        where: {
          slug: slugValue,
        },
      });
    }

    const isAvailable = !existingRecord;

    if (isAvailable) {
      return createSuccessResponse({
        available: true,
        message:
          field === "companyName"
            ? "Ce nom d'entreprise est disponible"
            : "Cet identifiant est disponible",
      });
    } else {
      return createSuccessResponse({
        available: false,
        message:
          field === "companyName"
            ? "Ce nom d'entreprise est déjà utilisé"
            : "Cet identifiant est déjà utilisé",
      });
    }
  } catch (error: any) {
    console.error("Erreur lors de la vérification de disponibilité:", error);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      500,
      "Erreur lors de la vérification de disponibilité"
    );
  }
};
