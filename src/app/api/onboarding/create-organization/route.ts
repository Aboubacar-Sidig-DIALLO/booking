import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/security-middleware";
import { z } from "zod";
import { logTenantAction, extractRequestInfo } from "@/lib/audit-logging";
import { cacheTenant } from "@/lib/tenant-resolver-edge";
import { sendWelcomeEmail } from "@/lib/email-service";
import { generateTemporaryPassword } from "@/lib/password-utils";

const OnboardingSchema = z.object({
  // Informations de l'entreprise
  companyName: z
    .string()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  companySlug: z
    .string()
    .min(2)
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets"
    ),
  companyDomain: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),

  // Informations de l'administrateur
  adminName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  adminEmail: z.string().email("Email invalide"),
  adminPhone: z.string().optional(),

  // Plan et fonctionnalités
  selectedPlan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE", "CUSTOM"]),
  selectedFeatures: z.array(z.string()),

  // Configuration initiale
  timezone: z.string().default("Europe/Paris"),
  language: z.string().default("fr"),
  currency: z.string().default("EUR"),
});

// POST /api/onboarding/create-organization
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = OnboardingSchema.parse(body);

    const { ipAddress, userAgent } = extractRequestInfo(req);

    try {
      // Vérifier que le slug n'existe pas déjà
      const existingOrg = await prisma.organization.findUnique({
        where: { slug: validatedData.companySlug } as any,
      });

      if (existingOrg) {
        const suggestedSlug = `${validatedData.companySlug}-${Date.now().toString().slice(-4)}`;
        return createErrorResponse(
          "Ce nom d'organisation est déjà utilisé. Veuillez en choisir un autre.",
          409,
          { suggestedSlug }
        );
      }

      // Vérifier que le domaine n'existe pas déjà (si fourni)
      if (validatedData.companyDomain) {
        const existingDomain = await prisma.organization.findUnique({
          where: { domain: validatedData.companyDomain } as any,
        });

        if (existingDomain) {
          return createErrorResponse(
            "DOMAIN_ALREADY_EXISTS",
            409,
            "Ce domaine est déjà utilisé par une autre organisation."
          );
        }
      }

      // Vérifier que l'email de l'administrateur n'existe pas déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.adminEmail },
      });

      if (existingUser) {
        return createErrorResponse(
          "EMAIL_ALREADY_EXISTS",
          409,
          "Cet email est déjà utilisé. Veuillez utiliser un autre email."
        );
      }

      // Préparer les données de l'organisation
      const organizationData: any = {
        name: validatedData.companyName,
        slug: validatedData.companySlug,
        plan: validatedData.selectedPlan,
        settings: {
          industry: validatedData.industry,
          companySize: validatedData.companySize,
          timezone: validatedData.timezone,
          language: validatedData.language,
          currency: validatedData.currency,
          onboarding: {
            completed: true,
            completedAt: new Date().toISOString(),
            steps: ["company", "admin", "plan", "config", "final"],
          },
        },
      };

      // Ajouter le domaine seulement s'il est fourni
      if (validatedData.companyDomain && validatedData.companyDomain.trim()) {
        organizationData.domain = validatedData.companyDomain;
      }

      // Créer l'organisation
      const organization = await prisma.organization.create({
        data: organizationData,
      });

      // Générer un mot de passe temporaire pour l'administrateur
      const { plainPassword, hashedPassword } = await generateTemporaryPassword(
        validatedData.companySlug,
        validatedData.companyName
      );

      // Créer l'administrateur principal avec mot de passe temporaire
      const adminUser = await prisma.user.create({
        data: {
          email: validatedData.adminEmail,
          name: validatedData.adminName,
          password: hashedPassword,
          mustChangePassword: true, // Force le changement à la première connexion
          role: "ADMIN",
          orgId: organization.id,
        },
      });

      // Activer les fonctionnalités sélectionnées
      for (const featureName of validatedData.selectedFeatures) {
        // Trouver la fonctionnalité par nom
        const feature = await prisma.feature.findUnique({
          where: { name: featureName },
        });

        if (feature) {
          await prisma.organizationFeature.create({
            data: {
              organizationId: organization.id,
              featureId: feature.id,
              isEnabled: true,
              settings: {},
            },
          });
        }
      }

      // Créer un site par défaut
      const defaultSite = await prisma.site.create({
        data: {
          name: "Siège Principal",
          orgId: organization.id,
        },
      });

      // Créer quelques salles d'exemple avec des slugs uniques
      const orgSlug = organization.slug;
      const defaultRooms = [
        {
          name: "Salle de Réunion A",
          slug: `${orgSlug}-salle-reunion-a`,
          capacity: 8,
          location: "Étage 1",
          floor: 1,
          description:
            "Salle de réunion équipée d'un écran et d'un tableau blanc",
          siteId: defaultSite.id,
          orgId: organization.id,
        },
        {
          name: "Salle de Réunion B",
          slug: `${orgSlug}-salle-reunion-b`,
          capacity: 12,
          location: "Étage 1",
          floor: 1,
          description:
            "Grande salle de réunion avec système de visioconférence",
          siteId: defaultSite.id,
          orgId: organization.id,
        },
        {
          name: "Open Space",
          slug: `${orgSlug}-open-space`,
          capacity: 20,
          location: "Étage 2",
          floor: 2,
          description: "Espace ouvert pour les événements et formations",
          siteId: defaultSite.id,
          orgId: organization.id,
        },
      ];

      for (const roomData of defaultRooms) {
        await prisma.room.create({ data: roomData });
      }

      // Mettre en cache le tenant
      cacheTenant((organization as any).slug, {
        id: organization.id,
        slug: (organization as any).slug,
        domain: (organization as any).domain || undefined,
        plan: (organization as any).plan,
        settings: (organization as any).settings,
      });

      // Logger l'action
      await logTenantAction({
        tenantId: organization.id,
        userId: adminUser.id,
        action: "CREATE_ORGANIZATION",
        entity: "organization",
        entityId: organization.id,
        metadata: {
          companyName: organization.name,
          slug: (organization as any).slug,
          plan: (organization as any).plan,
          features: validatedData.selectedFeatures,
        },
        ipAddress,
        userAgent,
      });

      // Envoyer l'email de bienvenue avec le mot de passe temporaire
      try {
        await sendWelcomeEmail({
          to: validatedData.adminEmail,
          adminName: validatedData.adminName,
          companyName: validatedData.companyName,
          companySlug: validatedData.companySlug,
          loginUrl: `http://${validatedData.companySlug}.localhost:3000/login`,
          temporaryPassword: plainPassword, // Inclure le mot de passe temporaire
        });
      } catch (emailError) {
        console.warn(
          "Erreur lors de l'envoi de l'email de bienvenue:",
          emailError
        );
        // Ne pas faire échouer la création pour une erreur d'email
      }

      return createSuccessResponse(
        {
          organization: {
            id: organization.id,
            name: organization.name,
            slug: (organization as any).slug,
            domain: (organization as any).domain,
            plan: (organization as any).plan,
          },
          admin: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
          },
          loginUrl: `http://${validatedData.companySlug}.localhost:3000/login`,
          dashboardUrl: `http://${validatedData.companySlug}.localhost:3000/home`,
        },
        "Organisation créée avec succès"
      );
    } catch (error: any) {
      console.error("Erreur lors de la création de l'organisation:", error);

      if (error.code === "P2002") {
        if (error.meta?.target?.includes("slug")) {
          return createErrorResponse(
            "SLUG_ALREADY_EXISTS",
            409,
            "Ce nom d'organisation est déjà utilisé."
          );
        }
        if (error.meta?.target?.includes("domain")) {
          return createErrorResponse(
            "DOMAIN_ALREADY_EXISTS",
            409,
            "Ce domaine est déjà utilisé."
          );
        }
        if (error.meta?.target?.includes("email")) {
          return createErrorResponse(
            "EMAIL_ALREADY_EXISTS",
            409,
            "Cet email est déjà utilisé."
          );
        }
      }

      return createErrorResponse(
        "INTERNAL_SERVER_ERROR",
        500,
        "Erreur lors de la création de l'organisation."
      );
    }
  } catch (error: any) {
    console.error("Erreur lors de la validation:", error);
    return createErrorResponse(
      "VALIDATION_ERROR",
      400,
      "Données d'entrée invalides"
    );
  }
};
