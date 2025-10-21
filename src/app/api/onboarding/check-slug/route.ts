import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";

// GET /api/onboarding/check-slug?slug=example
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return createErrorResponse(
      "MISSING_SLUG",
      400,
      "Le paramètre slug est requis."
    );
  }

  // Validation du format du slug
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return createErrorResponse(
      "INVALID_SLUG_FORMAT",
      400,
      "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets."
    );
  }

  try {
    const existingOrg = await prisma.organization.findUnique({
      where: { slug } as any,
      select: { id: true, slug: true } as any,
    });

    return createSuccessResponse({
      available: !existingOrg,
      slug: slug,
      suggestion: existingOrg
        ? `${slug}-${Date.now().toString().slice(-4)}`
        : null,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du slug:", error);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      500,
      "Erreur lors de la vérification du slug."
    );
  }
}
