import { NextRequest } from "next/server";
import { createSecurePrismaClient } from "@/lib/prisma-tenant";
import {
  createSuccessResponse,
  createErrorResponse,
  withTenantSecurity,
  withValidation,
} from "@/lib/security-middleware";
import { z } from "zod";
import { logTenantAction, extractRequestInfo } from "@/lib/audit-logging";
import { requireAuth } from "@/lib/withAuth";
import { assertCan } from "@/lib/rbac";

const SetupDataSchema = z.object({
  companyInfo: z.object({
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    }),
  }),
  rooms: z.array(
    z.object({
      name: z.string().min(1, "Le nom de la salle est requis"),
      capacity: z.number().min(1, "La capacité doit être d'au moins 1"),
      location: z.string().optional(),
      floor: z.number().optional(),
      description: z.string().optional(),
      equipment: z.array(z.string()).optional(),
    })
  ),
  settings: z.object({
    timezone: z.string().default("Europe/Paris"),
    language: z.string().default("fr"),
    currency: z.string().default("EUR"),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(false),
      push: z.boolean().default(true),
    }),
    booking: z.object({
      advanceBooking: z.number().min(1).default(30),
      maxBookingDuration: z.number().min(1).default(8),
      requireApproval: z.boolean().default(false),
      allowRecurring: z.boolean().default(true),
    }),
  }),
  branding: z.object({
    primaryColor: z.string().default("#3b82f6"),
    secondaryColor: z.string().default("#1e40af"),
    logo: z.string().optional(),
    favicon: z.string().optional(),
  }),
});

// POST /api/setup/complete - Finaliser la configuration initiale
export const POST = withTenantSecurity(
  withValidation(
    SetupDataSchema,
    async (req: NextRequest, { tenantId, validatedData }) => {
      const session = await requireAuth(req);
      if (!(session as any).user?.id) {
        return createErrorResponse("UNAUTHENTICATED", 401);
      }

      // Vérifier les permissions (seuls les admins peuvent finaliser la configuration)
      assertCan(
        ((session as any).user?.role ?? "VIEWER") as any,
        "organization:manage"
      );

      const prisma = createSecurePrismaClient(req);
      const { ipAddress, userAgent } = extractRequestInfo(req);

      try {
        // Mettre à jour les informations de l'organisation
        const updatedOrganization = await prisma.organization.update({
          where: { id: tenantId },
          data: {
            settings: {
              ...validatedData.companyInfo,
              branding: validatedData.branding,
              setup: {
                completed: true,
                completedAt: new Date().toISOString(),
                completedBy: (session as any).user.id,
              },
            },
          },
        });

        // Créer les salles
        const createdRooms = [];
        for (const roomData of validatedData.rooms) {
          // Trouver le site par défaut ou créer un site par défaut
          let defaultSite = await prisma.site.findFirst({
            where: {
              orgId: tenantId,
              settings: { path: ["isDefault"], equals: true },
            },
          });

          if (!defaultSite) {
            defaultSite = await prisma.site.create({
              data: {
                name: "Siège Principal",
                orgId: tenantId,
                settings: { isDefault: true },
              },
            });
          }

          const room = await prisma.room.create({
            data: {
              name: roomData.name,
              slug: generateSlug(roomData.name),
              capacity: roomData.capacity,
              location: roomData.location || "",
              floor: roomData.floor || 1,
              description: roomData.description || "",
              siteId: defaultSite.id,
              orgId: tenantId,
              settings: {
                equipment: roomData.equipment || [],
              },
            },
          });

          createdRooms.push(room);
        }

        // Mettre à jour les paramètres utilisateur
        await prisma.user.update({
          where: { id: (session as any).user.id },
          data: {
            settings: {
              notifications: validatedData.settings.notifications,
              preferences: {
                timezone: validatedData.settings.timezone,
                language: validatedData.settings.language,
                currency: validatedData.settings.currency,
              },
            },
          },
        });

        // Créer des paramètres d'organisation pour les règles de réservation
        await prisma.organizationFeature.upsert({
          where: {
            organizationId_featureId: {
              organizationId: tenantId,
              featureId: "booking_settings",
            },
          },
          update: {
            settings: validatedData.settings.booking,
          },
          create: {
            organizationId: tenantId,
            featureId: "booking_settings",
            isEnabled: true,
            settings: validatedData.settings.booking,
          },
        });

        // Logger l'action
        await logTenantAction({
          tenantId,
          userId: (session as any).user.id,
          action: "COMPLETE_SETUP",
          entity: "organization",
          entityId: tenantId,
          metadata: {
            roomsCreated: createdRooms.length,
            settings: validatedData.settings,
            branding: validatedData.branding,
          },
          ipAddress,
          userAgent,
        });

        return createSuccessResponse(
          {
            organization: {
              id: updatedOrganization.id,
              name: updatedOrganization.name,
              slug: updatedOrganization.slug,
              setupCompleted: true,
            },
            rooms: createdRooms.map((room) => ({
              id: room.id,
              name: room.name,
              slug: room.slug,
              capacity: room.capacity,
            })),
            settings: validatedData.settings,
            branding: validatedData.branding,
          },
          "Configuration terminée avec succès"
        );
      } catch (error) {
        console.error(
          "Erreur lors de la finalisation de la configuration:",
          error
        );
        return createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          500,
          "Erreur lors de la finalisation de la configuration."
        );
      }
    }
  )
);

// GET /api/setup/status - Vérifier le statut de la configuration
export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!(session as any).user?.id) {
    return createErrorResponse("UNAUTHENTICATED", 401);
  }

  const prisma = createSecurePrismaClient(req);

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: (session as any).user.orgId },
      select: {
        id: true,
        name: true,
        slug: true,
        settings: true,
        _count: {
          select: {
            rooms: true,
            users: true,
            sites: true,
          },
        },
      },
    });

    if (!organization) {
      return createErrorResponse(
        "ORGANIZATION_NOT_FOUND",
        404,
        "Organisation non trouvée."
      );
    }

    const setupStatus = {
      completed: organization.settings?.setup?.completed || false,
      completedAt: organization.settings?.setup?.completedAt,
      steps: {
        companyInfo: !!organization.settings?.description,
        rooms: organization._count.rooms > 0,
        settings: !!organization.settings?.setup,
        branding: !!organization.settings?.branding,
        team: organization._count.users > 1,
      },
      stats: {
        rooms: organization._count.rooms,
        users: organization._count.users,
        sites: organization._count.sites,
      },
    };

    return createSuccessResponse({
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      setupStatus,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du statut de configuration:",
      error
    );
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      500,
      "Erreur lors de la vérification du statut."
    );
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
