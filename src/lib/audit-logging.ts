import { prisma } from "@/lib/prisma-tenant";
import { NextRequest } from "next/server";

export interface AuditLogEntry {
  tenantId: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecurityEvent {
  tenantId: string;
  userId?: string;
  eventType:
    | "LOGIN"
    | "LOGOUT"
    | "FAILED_LOGIN"
    | "PERMISSION_DENIED"
    | "DATA_ACCESS"
    | "DATA_MODIFICATION";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

// Fonction pour logger une action d'audit
export async function logTenantAction(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        orgId: entry.tenantId,
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        metadata: entry.metadata || {},
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'audit log:", error);
  }
}

// Fonction pour logger un événement de sécurité
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    // Enregistrer dans les logs de sécurité (vous pouvez utiliser un service externe)
    console.warn("Security Event:", {
      timestamp: new Date().toISOString(),
      tenantId: event.tenantId,
      userId: event.userId,
      eventType: event.eventType,
      severity: event.severity,
      description: event.description,
      metadata: event.metadata,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
    });

    // Optionnellement, enregistrer dans la base de données pour les événements critiques
    if (event.severity === "CRITICAL" || event.severity === "HIGH") {
      await prisma.auditLog.create({
        data: {
          orgId: event.tenantId,
          userId: event.userId || "system",
          action: `SECURITY_${event.eventType}`,
          entity: "security",
          entityId: "system",
          metadata: {
            severity: event.severity,
            description: event.description,
            ...event.metadata,
          },
        },
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de l'événement de sécurité:",
      error
    );
  }
}

// Fonction pour extraire les informations de la requête
export function extractRequestInfo(request: NextRequest): {
  ipAddress: string;
  userAgent: string;
} {
  const forwarded = request.headers.get("x-forwarded-for");
  const ipAddress = forwarded
    ? forwarded.split(",")[0]
    : request.headers.get("x-real-ip") || "unknown";

  const userAgent = request.headers.get("user-agent") || "unknown";

  return { ipAddress, userAgent };
}

// Middleware pour logger automatiquement les actions
export function withAuditLogging(
  action: string,
  entity: string,
  handler: (
    request: NextRequest,
    context: { tenantId: string; userId: string }
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    { tenantId, userId }: { tenantId: string; userId: string }
  ) => {
    const { ipAddress, userAgent } = extractRequestInfo(request);

    try {
      const response = await handler(request, { tenantId, userId });

      // Logger l'action seulement si elle a réussi
      if (response.status < 400) {
        await logTenantAction({
          tenantId,
          userId,
          action,
          entity,
          entityId: "unknown", // Sera rempli par le handler spécifique
          metadata: {
            method: request.method,
            url: request.url,
            status: response.status,
          },
          ipAddress,
          userAgent,
        });
      }

      return response;
    } catch (error) {
      // Logger l'erreur
      await logSecurityEvent({
        tenantId,
        userId,
        eventType: "DATA_MODIFICATION",
        severity: "MEDIUM",
        description: `Erreur lors de l'exécution de l'action ${action}`,
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
          action,
          entity,
        },
        ipAddress,
        userAgent,
      });

      throw error;
    }
  };
}

// Fonction pour récupérer les logs d'audit d'un tenant
export async function getTenantAuditLogs(
  tenantId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    action?: string;
    entity?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{
  logs: any[];
  total: number;
}> {
  try {
    const where: any = {
      orgId: tenantId,
    };

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = options.startDate;
      if (options.endDate) where.createdAt.lte = options.endDate;
    }

    if (options.userId) where.userId = options.userId;
    if (options.action) where.action = { contains: options.action };
    if (options.entity) where.entity = options.entity;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: options.limit || 50,
        skip: options.offset || 0,
        include: {
          // Note: Vous devrez ajouter la relation User dans votre schéma Prisma
          // user: { select: { name: true, email: true } }
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  } catch (error) {
    console.error("Erreur lors de la récupération des logs d'audit:", error);
    return { logs: [], total: 0 };
  }
}

// Fonction pour nettoyer les anciens logs (à exécuter périodiquement)
export async function cleanupOldAuditLogs(
  olderThanDays: number = 90
): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(
      `Nettoyage des logs d'audit: ${result.count} entrées supprimées`
    );
    return result.count;
  } catch (error) {
    console.error("Erreur lors du nettoyage des logs d'audit:", error);
    return 0;
  }
}

// Fonction pour générer un rapport d'activité
export async function generateActivityReport(
  tenantId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalActions: number;
  actionsByType: Record<string, number>;
  actionsByUser: Record<string, number>;
  actionsByEntity: Record<string, number>;
  dailyActivity: Array<{ date: string; count: number }>;
}> {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        orgId: tenantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const report = {
      totalActions: logs.length,
      actionsByType: {} as Record<string, number>,
      actionsByUser: {} as Record<string, number>,
      actionsByEntity: {} as Record<string, number>,
      dailyActivity: [] as Array<{ date: string; count: number }>,
    };

    // Analyser les logs
    logs.forEach((log) => {
      // Actions par type
      report.actionsByType[log.action] =
        (report.actionsByType[log.action] || 0) + 1;

      // Actions par utilisateur
      report.actionsByUser[log.userId] =
        (report.actionsByUser[log.userId] || 0) + 1;

      // Actions par entité
      report.actionsByEntity[log.entity] =
        (report.actionsByEntity[log.entity] || 0) + 1;
    });

    // Activité quotidienne
    const dailyMap = new Map<string, number>();
    logs.forEach((log) => {
      const date = log.createdAt.toISOString().split("T")[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    report.dailyActivity = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return report;
  } catch (error) {
    console.error("Erreur lors de la génération du rapport d'activité:", error);
    return {
      totalActions: 0,
      actionsByType: {},
      actionsByUser: {},
      actionsByEntity: {},
      dailyActivity: [],
    };
  }
}

// Fonction pour détecter des activités suspectes
export async function detectSuspiciousActivity(tenantId: string): Promise<{
  suspiciousLogins: number;
  unusualHours: number;
  bulkOperations: number;
  permissionDenied: number;
}> {
  try {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const logs = await prisma.auditLog.findMany({
      where: {
        orgId: tenantId,
        createdAt: {
          gte: last24Hours,
        },
      },
    });

    const suspicious = {
      suspiciousLogins: 0,
      unusualHours: 0,
      bulkOperations: 0,
      permissionDenied: 0,
    };

    logs.forEach((log) => {
      // Connexions suspectes (plusieurs tentatives échouées)
      if (log.action.includes("FAILED_LOGIN")) {
        suspicious.suspiciousLogins++;
      }

      // Activité en dehors des heures normales (22h-6h)
      const hour = log.createdAt.getHours();
      if (hour >= 22 || hour <= 6) {
        suspicious.unusualHours++;
      }

      // Opérations en masse
      if (log.action.includes("BULK") || log.action.includes("BATCH")) {
        suspicious.bulkOperations++;
      }

      // Accès refusés
      if (log.action.includes("PERMISSION_DENIED")) {
        suspicious.permissionDenied++;
      }
    });

    return suspicious;
  } catch (error) {
    console.error("Erreur lors de la détection d'activité suspecte:", error);
    return {
      suspiciousLogins: 0,
      unusualHours: 0,
      bulkOperations: 0,
      permissionDenied: 0,
    };
  }
}
