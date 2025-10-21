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
import { sendInvitationEmail } from "@/lib/email-service";
import { requireAuth } from "@/lib/withAuth";
import { assertCan } from "@/lib/rbac";

const InviteUserSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.enum(["ADMIN", "MANAGER", "USER", "VIEWER"]),
  message: z.string().optional(),
});

const AcceptInvitationSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .optional(),
});

// POST /api/invitations/send - Envoyer une invitation
export const POST = withTenantSecurity(
  withValidation(
    InviteUserSchema,
    async (req: NextRequest, { tenantId, validatedData }) => {
      const session = await requireAuth(req);
      if (!(session as any).user?.id) {
        return createErrorResponse("UNAUTHENTICATED", 401);
      }

      // Vérifier les permissions
      assertCan(
        ((session as any).user?.role ?? "VIEWER") as any,
        "users:invite"
      );

      const prisma = createSecurePrismaClient(req);
      const { ipAddress, userAgent } = extractRequestInfo(req);

      try {
        // Vérifier si l'utilisateur existe déjà dans cette organisation
        const existingUser = await prisma.user.findFirst({
          where: {
            email: validatedData.email,
            orgId: tenantId,
          },
        });

        if (existingUser) {
          return createErrorResponse(
            "USER_ALREADY_EXISTS",
            409,
            "Cet utilisateur fait déjà partie de votre organisation."
          );
        }

        // Vérifier s'il y a déjà une invitation en attente
        const existingInvitation = await prisma.invitation.findFirst({
          where: {
            email: validatedData.email,
            orgId: tenantId,
            status: "PENDING",
          },
        });

        if (existingInvitation) {
          return createErrorResponse(
            "INVITATION_ALREADY_EXISTS",
            409,
            "Une invitation est déjà en attente pour cet utilisateur."
          );
        }

        // Créer l'invitation
        const invitation = await prisma.invitation.create({
          data: {
            email: validatedData.email,
            name: validatedData.name,
            role: validatedData.role,
            orgId: tenantId,
            invitedById: (session as any).user.id,
            message: validatedData.message,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
            token: generateInvitationToken(),
          },
        });

        // Envoyer l'email d'invitation
        try {
          const organization = await prisma.organization.findUnique({
            where: { id: tenantId },
            select: { name: true, slug: true },
          });

          if (organization) {
            await sendInvitationEmail({
              to: validatedData.email,
              inviterName: (session as any).user.name || "Un administrateur",
              companyName: organization.name,
              companySlug: organization.slug,
              role: validatedData.role,
              invitationUrl: `http://${organization.slug}.localhost:3000/invitation/accept?token=${invitation.token}`,
            });
          }
        } catch (emailError) {
          console.warn(
            "Erreur lors de l'envoi de l'email d'invitation:",
            emailError
          );
          // Ne pas faire échouer l'invitation pour une erreur d'email
        }

        // Logger l'action
        await logTenantAction({
          tenantId,
          userId: (session as any).user.id,
          action: "SEND_INVITATION",
          entity: "invitation",
          entityId: invitation.id,
          metadata: {
            invitedEmail: validatedData.email,
            role: validatedData.role,
          },
          ipAddress,
          userAgent,
        });

        return createSuccessResponse(
          {
            invitation: {
              id: invitation.id,
              email: invitation.email,
              role: invitation.role,
              expiresAt: invitation.expiresAt,
            },
          },
          "Invitation envoyée avec succès"
        );
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'invitation:", error);
        return createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          500,
          "Erreur lors de l'envoi de l'invitation."
        );
      }
    }
  )
);

// GET /api/invitations - Lister les invitations
export const GET = withTenantSecurity(
  async (req: NextRequest, { tenantId }) => {
    const session = await requireAuth(req);
    if (!(session as any).user?.id) {
      return createErrorResponse("UNAUTHENTICATED", 401);
    }

    assertCan(((session as any).user?.role ?? "VIEWER") as any, "users:read");

    const prisma = createSecurePrismaClient(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    try {
      const invitations = await prisma.invitation.findMany({
        where: {
          orgId: tenantId,
          status: status as any,
        },
        include: {
          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return createSuccessResponse(invitations);
    } catch (error) {
      console.error("Erreur lors de la récupération des invitations:", error);
      return createErrorResponse(
        "INTERNAL_SERVER_ERROR",
        500,
        "Erreur lors de la récupération des invitations."
      );
    }
  }
);

// DELETE /api/invitations/[id] - Annuler une invitation
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAuth(req);
  if (!(session as any).user?.id) {
    return createErrorResponse("UNAUTHENTICATED", 401);
  }

  const prisma = createSecurePrismaClient(req);
  const { ipAddress, userAgent } = extractRequestInfo(req);

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: { organization: true },
    });

    if (!invitation) {
      return createErrorResponse(
        "INVITATION_NOT_FOUND",
        404,
        "Invitation non trouvée."
      );
    }

    // Vérifier les permissions
    assertCan(((session as any).user?.role ?? "VIEWER") as any, "users:manage");

    // Annuler l'invitation
    await prisma.invitation.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    // Logger l'action
    await logTenantAction({
      tenantId: invitation.orgId,
      userId: (session as any).user.id,
      action: "CANCEL_INVITATION",
      entity: "invitation",
      entityId: invitation.id,
      metadata: {
        invitedEmail: invitation.email,
      },
      ipAddress,
      userAgent,
    });

    return createSuccessResponse(null, "Invitation annulée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'invitation:", error);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      500,
      "Erreur lors de l'annulation de l'invitation."
    );
  }
}

function generateInvitationToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
