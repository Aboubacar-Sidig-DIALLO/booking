import { NextRequest, NextResponse } from "next/server";
import {
  withTenantSecurity,
  withManagerAccess,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import { detectSuspiciousActivity } from "@/lib/audit-logging";

// GET /api/tenant/security-alerts - Détecter les activités suspectes
export const GET = withManagerAccess(async (req: NextRequest, { tenantId }) => {
  try {
    const suspiciousActivity = await detectSuspiciousActivity(tenantId);

    return createSuccessResponse(suspiciousActivity);
  } catch (error) {
    console.error("Erreur lors de la détection d'activité suspecte:", error);
    return createErrorResponse(
      "Erreur lors de la détection d'activité suspecte",
      500
    );
  }
});
