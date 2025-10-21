import { NextRequest, NextResponse } from "next/server";
import {
  getTenantIdFromRequest,
  createSecurePrismaClient,
  ensureTenantAccess,
} from "@/lib/prisma-tenant";
import { checkFeatureAccess, requireFeature } from "@/lib/feature-flags";
import { TenantFeature } from "@/types/tenant";

// Middleware de sécurité pour les API routes
export function withTenantSecurity(
  handler: (
    request: NextRequest,
    context: { tenantId: string }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const tenantId = getTenantIdFromRequest(request);

      if (!tenantId) {
        return NextResponse.json(
          { error: "Tenant ID manquant dans la requête" },
          { status: 401 }
        );
      }

      return await handler(request, { tenantId });
    } catch (error) {
      console.error("Erreur de sécurité tenant:", error);
      return NextResponse.json(
        { error: "Erreur d'authentification tenant" },
        { status: 401 }
      );
    }
  };
}

// Middleware avec vérification de fonctionnalité
export function withFeatureCheck(
  feature: TenantFeature,
  handler: (
    request: NextRequest,
    context: { tenantId: string }
  ) => Promise<NextResponse>
) {
  return withTenantSecurity(async (request: NextRequest, { tenantId }) => {
    try {
      const hasAccess = await checkFeatureAccess(tenantId, feature);

      if (!hasAccess) {
        return NextResponse.json(
          {
            error: `Fonctionnalité ${feature} non disponible`,
            feature,
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }

      return await handler(request, { tenantId });
    } catch (error) {
      console.error(
        `Erreur de vérification de fonctionnalité ${feature}:`,
        error
      );
      return NextResponse.json(
        { error: "Erreur de vérification de fonctionnalité" },
        { status: 500 }
      );
    }
  });
}

// Middleware avec vérification de rôle utilisateur
export function withUserRole(
  allowedRoles: string[],
  handler: (
    request: NextRequest,
    context: { tenantId: string; userId: string }
  ) => Promise<NextResponse>
) {
  return withTenantSecurity(async (request: NextRequest, { tenantId }) => {
    try {
      const userId = request.headers.get("x-user-id");

      if (!userId) {
        return NextResponse.json(
          { error: "User ID manquant dans la requête" },
          { status: 401 }
        );
      }

      const prisma = createSecurePrismaClient(request);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, orgId: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      // Vérifier que l'utilisateur appartient au bon tenant
      if (user.orgId !== tenantId) {
        return NextResponse.json(
          { error: "Accès non autorisé à cette organisation" },
          { status: 403 }
        );
      }

      // Vérifier le rôle
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: "Permissions insuffisantes" },
          { status: 403 }
        );
      }

      return await handler(request, { tenantId, userId });
    } catch (error) {
      console.error("Erreur de vérification de rôle:", error);
      return NextResponse.json(
        { error: "Erreur de vérification de permissions" },
        { status: 500 }
      );
    }
  });
}

// Fonction utilitaire pour valider l'accès à une ressource
export async function validateResourceAccess(
  request: NextRequest,
  resourceId: string,
  resourceType: "booking" | "room" | "site" | "user"
): Promise<{ success: boolean; error?: string }> {
  try {
    const tenantId = getTenantIdFromRequest(request);
    if (!tenantId) {
      return { success: false, error: "Tenant ID manquant" };
    }

    const prisma = createSecurePrismaClient(request);

    let resource;
    switch (resourceType) {
      case "booking":
        resource = await prisma.booking.findUnique({
          where: { id: resourceId },
          select: { orgId: true },
        });
        break;
      case "room":
        resource = await prisma.room.findUnique({
          where: { id: resourceId },
          select: { orgId: true },
        });
        break;
      case "site":
        resource = await prisma.site.findUnique({
          where: { id: resourceId },
          select: { orgId: true },
        });
        break;
      case "user":
        resource = await prisma.user.findUnique({
          where: { id: resourceId },
          select: { orgId: true },
        });
        break;
      default:
        return { success: false, error: "Type de ressource non supporté" };
    }

    if (!resource) {
      return { success: false, error: "Ressource non trouvée" };
    }

    if (resource.orgId !== tenantId) {
      return { success: false, error: "Accès non autorisé à cette ressource" };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur de validation d'accès:", error);
    return { success: false, error: "Erreur interne" };
  }
}

// Middleware pour les routes d'administration
export function withAdminAccess(
  handler: (
    request: NextRequest,
    context: { tenantId: string; userId: string }
  ) => Promise<NextResponse>
) {
  return withUserRole(["ADMIN"], handler);
}

// Middleware pour les routes de gestion
export function withManagerAccess(
  handler: (
    request: NextRequest,
    context: { tenantId: string; userId: string }
  ) => Promise<NextResponse>
) {
  return withUserRole(["ADMIN", "MANAGER"], handler);
}

// Fonction pour créer une réponse d'erreur standardisée
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    },
    { status }
  );
}

// Fonction pour créer une réponse de succès standardisée
export function createSuccessResponse(
  data: any,
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  });
}

// Middleware pour la validation des données d'entrée
export function withValidation<T>(
  schema: any, // Zod schema
  handler: (
    request: NextRequest,
    context: { tenantId: string; validatedData: T }
  ) => Promise<NextResponse>
) {
  return withTenantSecurity(async (request: NextRequest, { tenantId }) => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);

      return await handler(request, { tenantId, validatedData });
    } catch (error) {
      console.error("Erreur de validation:", error);
      return createErrorResponse("Données d'entrée invalides", 400, error);
    }
  });
}

// Middleware pour la limitation de taux par tenant
export function withRateLimit(
  maxRequests: number,
  windowMs: number,
  handler: (
    request: NextRequest,
    context: { tenantId: string }
  ) => Promise<NextResponse>
) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return withTenantSecurity(async (request: NextRequest, { tenantId }) => {
    const now = Date.now();
    const key = `${tenantId}:${Math.floor(now / windowMs)}`;

    const current = requests.get(key) || {
      count: 0,
      resetTime: now + windowMs,
    };

    if (current.count >= maxRequests) {
      return createErrorResponse("Limite de taux dépassée", 429, {
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
        limit: maxRequests,
        window: windowMs,
      });
    }

    current.count++;
    requests.set(key, current);

    // Nettoyer les anciennes entrées
    for (const [k, v] of requests.entries()) {
      if (v.resetTime < now) {
        requests.delete(k);
      }
    }

    return await handler(request, { tenantId });
  });
}
