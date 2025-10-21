import { PrismaClient, Prisma } from "@prisma/client";

// Client Prisma global
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Client Prisma avec isolation automatique par tenant
export function createTenantPrismaClient(tenantId: string): PrismaClient {
  const client = new PrismaClient();

  // Middleware pour filtrer automatiquement par tenant
  client.$use(async (params, next) => {
    // Modèles qui nécessitent une isolation par tenant
    const tenantIsolatedModels = [
      "User",
      "Site",
      "Room",
      "Booking",
      "BookingParticipant",
      "Message",
      "Favorite",
      "Notification",
      "Checkin",
      "ReportCache",
      "AuditLog",
    ];

    if (tenantIsolatedModels.includes(params.model || "")) {
      // Ajouter automatiquement le filtre tenantId
      if (params.action === "findMany" || params.action === "findFirst") {
        params.args.where = {
          ...params.args.where,
          orgId: tenantId,
        };
      } else if (params.action === "findUnique") {
        // Pour findUnique, vérifier que l'enregistrement appartient au tenant
        const result = await next(params);
        if (result && (result as any).orgId !== tenantId) {
          throw new Error("Accès non autorisé à cette ressource");
        }
        return result;
      } else if (params.action === "create") {
        // Ajouter automatiquement le tenantId lors de la création
        params.args.data = {
          ...params.args.data,
          orgId: tenantId,
        };
      } else if (params.action === "update" || params.action === "updateMany") {
        // Vérifier que l'enregistrement appartient au tenant avant la mise à jour
        if (params.action === "update") {
          const existing = await client[
            params.model as keyof PrismaClient
          ].findUnique({
            where: params.args.where,
          });
          if (existing && (existing as any).orgId !== tenantId) {
            throw new Error("Accès non autorisé à cette ressource");
          }
        }

        params.args.where = {
          ...params.args.where,
          orgId: tenantId,
        };
      } else if (params.action === "delete" || params.action === "deleteMany") {
        // Vérifier que l'enregistrement appartient au tenant avant la suppression
        if (params.action === "delete") {
          const existing = await client[
            params.model as keyof PrismaClient
          ].findUnique({
            where: params.args.where,
          });
          if (existing && (existing as any).orgId !== tenantId) {
            throw new Error("Accès non autorisé à cette ressource");
          }
        }

        params.args.where = {
          ...params.args.where,
          orgId: tenantId,
        };
      }
    }

    return next(params);
  });

  return client;
}

// Fonction utilitaire pour obtenir le tenantId depuis la requête
export function getTenantIdFromRequest(request: Request): string | null {
  const tenantId = request.headers.get("x-tenant-id");
  return tenantId;
}

// Fonction utilitaire pour créer un client Prisma sécurisé depuis une requête
export function createSecurePrismaClient(request: Request): PrismaClient {
  const tenantId = getTenantIdFromRequest(request);

  if (!tenantId) {
    throw new Error("Tenant ID manquant dans la requête");
  }

  return createTenantPrismaClient(tenantId);
}

// Fonction pour vérifier l'accès à une ressource
export async function ensureTenantAccess(
  tenantId: string,
  resourceOrgId: string,
  resourceType: string = "ressource"
): Promise<void> {
  if (tenantId !== resourceOrgId) {
    throw new Error(`Accès non autorisé à cette ${resourceType}`);
  }
}

// Fonction pour vérifier l'accès à une ressource par ID
export async function ensureResourceAccess(
  tenantId: string,
  model: keyof PrismaClient,
  resourceId: string
): Promise<void> {
  const resource = await (prisma[model] as any).findUnique({
    where: { id: resourceId },
    select: { orgId: true },
  });

  if (!resource) {
    throw new Error("Ressource introuvable");
  }

  if (resource.orgId !== tenantId) {
    throw new Error("Accès non autorisé à cette ressource");
  }
}
