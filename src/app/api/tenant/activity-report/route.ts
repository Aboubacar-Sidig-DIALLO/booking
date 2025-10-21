import { NextRequest, NextResponse } from "next/server";
import {
  withTenantSecurity,
  withManagerAccess,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import {
  generateActivityReport,
  detectSuspiciousActivity,
} from "@/lib/audit-logging";

// GET /api/tenant/activity-report - Générer un rapport d'activité
export const GET = withManagerAccess(async (req: NextRequest, { tenantId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return createErrorResponse(
        "Les paramètres startDate et endDate sont requis",
        400
      );
    }

    const report = await generateActivityReport(
      tenantId,
      new Date(startDate),
      new Date(endDate)
    );

    return createSuccessResponse(report);
  } catch (error) {
    console.error("Erreur lors de la génération du rapport d'activité:", error);
    return createErrorResponse(
      "Erreur lors de la génération du rapport d'activité",
      500
    );
  }
});
