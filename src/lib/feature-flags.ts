import { prisma } from "@/lib/prisma-tenant";
import { TENANT_FEATURES, TenantFeature } from "@/types/tenant";

// Fonction pour vérifier l'accès à une fonctionnalité
export async function checkFeatureAccess(
  tenantId: string,
  feature: TenantFeature
): Promise<boolean> {
  try {
    const organizationFeature = await prisma.organizationFeature.findFirst({
      where: {
        organizationId: tenantId,
        feature: {
          name: feature,
        },
        isEnabled: true,
      },
    });

    return !!organizationFeature;
  } catch (error) {
    console.error(
      `Erreur lors de la vérification de l'accès à la fonctionnalité ${feature}:`,
      error
    );
    return false;
  }
}

// Fonction pour récupérer les paramètres d'une fonctionnalité
export async function getFeatureSettings(
  tenantId: string,
  feature: TenantFeature
): Promise<any> {
  try {
    const organizationFeature = await prisma.organizationFeature.findFirst({
      where: {
        organizationId: tenantId,
        feature: {
          name: feature,
        },
        isEnabled: true,
      },
    });

    return organizationFeature?.settings || null;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des paramètres de la fonctionnalité ${feature}:`,
      error
    );
    return null;
  }
}

// Fonction pour activer une fonctionnalité pour un tenant
export async function enableFeatureForTenant(
  tenantId: string,
  feature: TenantFeature,
  settings?: any
): Promise<void> {
  try {
    const featureRecord = await prisma.feature.findUnique({
      where: { name: feature },
    });

    if (!featureRecord) {
      throw new Error(`Fonctionnalité ${feature} introuvable`);
    }

    await prisma.organizationFeature.upsert({
      where: {
        organizationId_featureId: {
          organizationId: tenantId,
          featureId: featureRecord.id,
        },
      },
      update: {
        isEnabled: true,
        settings,
      },
      create: {
        organizationId: tenantId,
        featureId: featureRecord.id,
        isEnabled: true,
        settings,
      },
    });
  } catch (error) {
    console.error(
      `Erreur lors de l'activation de la fonctionnalité ${feature}:`,
      error
    );
    throw error;
  }
}

// Fonction pour désactiver une fonctionnalité pour un tenant
export async function disableFeatureForTenant(
  tenantId: string,
  feature: TenantFeature
): Promise<void> {
  try {
    const featureRecord = await prisma.feature.findUnique({
      where: { name: feature },
    });

    if (!featureRecord) {
      throw new Error(`Fonctionnalité ${feature} introuvable`);
    }

    await prisma.organizationFeature.updateMany({
      where: {
        organizationId: tenantId,
        featureId: featureRecord.id,
      },
      data: {
        isEnabled: false,
      },
    });
  } catch (error) {
    console.error(
      `Erreur lors de la désactivation de la fonctionnalité ${feature}:`,
      error
    );
    throw error;
  }
}

// Fonction pour récupérer toutes les fonctionnalités d'un tenant
export async function getTenantFeatures(tenantId: string): Promise<
  Array<{
    name: string;
    isEnabled: boolean;
    settings?: any;
  }>
> {
  try {
    const organizationFeatures = await prisma.organizationFeature.findMany({
      where: {
        organizationId: tenantId,
      },
      include: {
        feature: true,
      },
    });

    return organizationFeatures.map((orgFeature) => ({
      name: orgFeature.feature.name,
      isEnabled: orgFeature.isEnabled,
      settings: orgFeature.settings,
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des fonctionnalités du tenant:",
      error
    );
    return [];
  }
}

// Fonction pour initialiser les fonctionnalités par défaut selon le plan
export async function initializeDefaultFeatures(
  tenantId: string,
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE" | "CUSTOM"
): Promise<void> {
  const defaultFeatures = {
    STARTER: [TENANT_FEATURES.RECURRING_BOOKINGS],
    PROFESSIONAL: [
      TENANT_FEATURES.RECURRING_BOOKINGS,
      TENANT_FEATURES.ANALYTICS,
      TENANT_FEATURES.MULTI_SITE,
    ],
    ENTERPRISE: [
      TENANT_FEATURES.RECURRING_BOOKINGS,
      TENANT_FEATURES.ANALYTICS,
      TENANT_FEATURES.MULTI_SITE,
      TENANT_FEATURES.ADVANCED_REPORTS,
      TENANT_FEATURES.API_ACCESS,
      TENANT_FEATURES.INTEGRATIONS,
    ],
    CUSTOM: [], // Fonctionnalités définies manuellement
  };

  const featuresToEnable = defaultFeatures[plan];

  for (const feature of featuresToEnable) {
    await enableFeatureForTenant(tenantId, feature);
  }
}

// Fonction pour créer les fonctionnalités de base dans la base de données
export async function seedDefaultFeatures(): Promise<void> {
  const features = [
    {
      name: TENANT_FEATURES.ANALYTICS,
      icon: "BarChart3",
      description: "Analytics et rapports avancés",
    },
    {
      name: TENANT_FEATURES.RECURRING_BOOKINGS,
      icon: "Repeat",
      description: "Réservations récurrentes",
    },
    {
      name: TENANT_FEATURES.CUSTOM_BRANDING,
      icon: "Palette",
      description: "Personnalisation de la marque",
    },
    {
      name: TENANT_FEATURES.API_ACCESS,
      icon: "Code",
      description: "Accès API",
    },
    {
      name: TENANT_FEATURES.ADVANCED_REPORTS,
      icon: "FileText",
      description: "Rapports avancés",
    },
    {
      name: TENANT_FEATURES.MULTI_SITE,
      icon: "Building",
      description: "Gestion multi-sites",
    },
    {
      name: TENANT_FEATURES.INTEGRATIONS,
      icon: "Zap",
      description: "Intégrations tierces",
    },
    {
      name: TENANT_FEATURES.WHITE_LABEL,
      icon: "Shield",
      description: "Solution white-label",
    },
  ];

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { name: feature.name },
      update: feature,
      create: feature,
    });
  }
}

// Middleware pour vérifier l'accès aux fonctionnalités dans les API routes
export function requireFeature(feature: TenantFeature) {
  return async (tenantId: string): Promise<void> => {
    const hasAccess = await checkFeatureAccess(tenantId, feature);
    if (!hasAccess) {
      throw new Error(
        `Fonctionnalité ${feature} non disponible pour ce tenant`
      );
    }
  };
}
