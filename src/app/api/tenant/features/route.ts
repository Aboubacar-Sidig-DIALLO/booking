import { NextRequest, NextResponse } from "next/server";
import {
  withTenantSecurity,
  withAdminAccess,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import {
  enableFeatureForTenant,
  disableFeatureForTenant,
  getTenantFeatures,
} from "@/lib/feature-flags";
import { logTenantAction, extractRequestInfo } from "@/lib/audit-logging";
import { z } from "zod";

const FeatureToggleSchema = z.object({
  feature: z.string(),
  enabled: z.boolean(),
  settings: z.any().optional(),
});

// GET /api/tenant/features - Récupérer les fonctionnalités du tenant
export const GET = withTenantSecurity(
  async (req: NextRequest, { tenantId }) => {
    try {
      const features = await getTenantFeatures(tenantId);
      return createSuccessResponse(features);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des fonctionnalités:",
        error
      );
      return createErrorResponse(
        "Erreur lors de la récupération des fonctionnalités",
        500
      );
    }
  }
);

// POST /api/tenant/features - Activer/désactiver une fonctionnalité
export const POST = withAdminAccess(
  async (req: NextRequest, { tenantId, userId }) => {
    try {
      const body = await req.json();
      const validatedData = FeatureToggleSchema.parse(body);

      const { ipAddress, userAgent } = extractRequestInfo(req);

      if (validatedData.enabled) {
        await enableFeatureForTenant(
          tenantId,
          validatedData.feature as any,
          validatedData.settings
        );
      } else {
        await disableFeatureForTenant(tenantId, validatedData.feature as any);
      }

      // Log de l'action
      await logTenantAction({
        tenantId,
        userId,
        action: validatedData.enabled ? "ENABLE_FEATURE" : "DISABLE_FEATURE",
        entity: "feature",
        entityId: validatedData.feature,
        metadata: {
          feature: validatedData.feature,
          enabled: validatedData.enabled,
          settings: validatedData.settings,
        },
        ipAddress,
        userAgent,
      });

      return createSuccessResponse(
        { feature: validatedData.feature, enabled: validatedData.enabled },
        `Fonctionnalité ${validatedData.enabled ? "activée" : "désactivée"} avec succès`
      );
    } catch (error) {
      console.error(
        "Erreur lors de la modification de la fonctionnalité:",
        error
      );
      return createErrorResponse(
        "Erreur lors de la modification de la fonctionnalité",
        500
      );
    }
  }
);
