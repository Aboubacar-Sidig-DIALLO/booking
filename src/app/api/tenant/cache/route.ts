import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma-tenant";
import { cacheTenant } from "@/lib/tenant-resolver-edge";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";

// GET /api/tenant/cache - Initialiser le cache des tenants
export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les tenants depuis la base de données
    const tenants = await prisma.organization.findMany({
      select: {
        id: true,
        slug: true,
        domain: true,
        plan: true,
        settings: true,
      },
    });

    // Mettre en cache chaque tenant
    tenants.forEach((tenant) => {
      cacheTenant(tenant.slug, {
        id: tenant.id,
        slug: tenant.slug,
        domain: tenant.domain || undefined,
        plan: tenant.plan,
        settings: tenant.settings,
      });
    });

    return createSuccessResponse(
      {
        cached: tenants.length,
        tenants: tenants.map((t) => ({
          slug: t.slug,
          domain: t.domain,
          plan: t.plan,
        })),
      },
      "Cache des tenants initialisé"
    );
  } catch (error) {
    console.error("Erreur lors de l'initialisation du cache:", error);
    return createErrorResponse("Erreur lors de l'initialisation du cache", 500);
  }
}
