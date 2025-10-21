import { NextRequest, NextResponse } from "next/server";
import {
  withTenantSecurity,
  withAdminAccess,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import {
  createTenant,
  updateTenantSettings,
  enableFeatureForTenant,
  disableFeatureForTenant,
} from "@/lib/tenant-resolver";
import { initializeDefaultFeatures } from "@/lib/feature-flags";
import { logTenantAction, extractRequestInfo } from "@/lib/audit-logging";
import { z } from "zod";

const CreateTenantSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets"
    ),
  domain: z.string().optional(),
  plan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE", "CUSTOM"]).optional(),
  settings: z.any().optional(),
});

const UpdateTenantSettingsSchema = z.object({
  settings: z.any(),
});

const FeatureToggleSchema = z.object({
  feature: z.string(),
  enabled: z.boolean(),
  settings: z.any().optional(),
});

// POST /api/tenant - Créer un nouveau tenant
export const POST = withAdminAccess(
  async (req: NextRequest, { tenantId, userId }) => {
    try {
      const body = await req.json();
      const validatedData = CreateTenantSchema.parse(body);

      const { ipAddress, userAgent } = extractRequestInfo(req);

      // Créer le tenant
      const tenant = await createTenant({
        name: validatedData.name,
        slug: validatedData.slug,
        domain: validatedData.domain,
        plan: validatedData.plan || "STARTER",
        settings: validatedData.settings,
      });

      // Initialiser les fonctionnalités par défaut
      await initializeDefaultFeatures(tenant.id, tenant.plan);

      // Log de l'action
      await logTenantAction({
        tenantId: tenant.id,
        userId,
        action: "CREATE_TENANT",
        entity: "organization",
        entityId: tenant.id,
        metadata: {
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan,
        },
        ipAddress,
        userAgent,
      });

      return createSuccessResponse(tenant, "Tenant créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du tenant:", error);
      return createErrorResponse("Erreur lors de la création du tenant", 500);
    }
  }
);

// GET /api/tenant - Récupérer les informations du tenant actuel
export const GET = withTenantSecurity(
  async (req: NextRequest, { tenantId }) => {
    try {
      const { resolveTenant } = await import("@/lib/tenant-resolver");
      const { tenant } = await resolveTenant(req);

      if (!tenant) {
        return createErrorResponse("Tenant non trouvé", 404);
      }

      return createSuccessResponse(tenant);
    } catch (error) {
      console.error("Erreur lors de la récupération du tenant:", error);
      return createErrorResponse(
        "Erreur lors de la récupération du tenant",
        500
      );
    }
  }
);

// PATCH /api/tenant - Mettre à jour les paramètres du tenant
export const PATCH = withAdminAccess(
  async (req: NextRequest, { tenantId, userId }) => {
    try {
      const body = await req.json();
      const validatedData = UpdateTenantSettingsSchema.parse(body);

      const { ipAddress, userAgent } = extractRequestInfo(req);

      const updatedTenant = await updateTenantSettings(
        tenantId,
        validatedData.settings
      );

      // Log de l'action
      await logTenantAction({
        tenantId,
        userId,
        action: "UPDATE_TENANT_SETTINGS",
        entity: "organization",
        entityId: tenantId,
        metadata: {
          settings: validatedData.settings,
        },
        ipAddress,
        userAgent,
      });

      return createSuccessResponse(
        updatedTenant,
        "Paramètres mis à jour avec succès"
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      return createErrorResponse(
        "Erreur lors de la mise à jour des paramètres",
        500
      );
    }
  }
);
