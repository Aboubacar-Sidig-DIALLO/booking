import { NextRequest, NextResponse } from "next/server";
import {
  withTenantSecurity,
  withManagerAccess,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import {
  getTenantAuditLogs,
  generateActivityReport,
  detectSuspiciousActivity,
} from "@/lib/audit-logging";

// GET /api/tenant/audit-logs - Récupérer les logs d'audit
export const GET = withManagerAccess(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const userId = searchParams.get("userId");
    const action = searchParams.get("action");
    const entity = searchParams.get("entity");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const logs = await getTenantAuditLogs(tenantId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      userId,
      action,
      entity,
      limit,
      offset,
    });

    return createSuccessResponse(logs);
  } catch (error) {
    console.error("Erreur lors de la récupération des logs d'audit:", error);
    return createErrorResponse(
      "Erreur lors de la récupération des logs d'audit",
      500
    );
  }
});
