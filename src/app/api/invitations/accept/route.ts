import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma-tenant";
import {
  createSuccessResponse,
  createErrorResponse,
  withValidation,
} from "@/lib/security-middleware";
import { z } from "zod";
import { logTenantAction, extractRequestInfo } from "@/lib/audit-logging";
import bcrypt from "bcryptjs";

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

// POST /api/invitations/accept - Accepter une invitation
export const POST = withValidation(
  AcceptInvitationSchema,
  async (req: NextRequest, { validatedData }) => {
    const { ipAddress, userAgent } = extractRequestInfo(req);

    try {
      // Trouver l'invitation
      const invitation = await prisma.invitation.findFirst({
        where: {
          token: validatedData.token,
          status: "PENDING",
        },
        include: {
          organization: true,
          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!invitation) {
        return createErrorResponse(
          "INVITATION_NOT_FOUND",
          404,
          "Invitation non trouvée ou expirée."
        );
      }

      // Vérifier si l'invitation a expiré
      if (invitation.expiresAt < new Date()) {
        await prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: "EXPIRED" },
        });
        return createErrorResponse(
          "INVITATION_EXPIRED",
          410,
          "Cette invitation a expiré."
        );
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findFirst({
        where: {
          email: invitation.email,
          orgId: invitation.orgId,
        },
      });

      if (existingUser) {
        return createErrorResponse(
          "USER_ALREADY_EXISTS",
          409,
          "Vous faites déjà partie de cette organisation."
        );
      }

      // Créer le mot de passe hashé
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email: invitation.email,
          name: validatedData.name || invitation.name,
          password: hashedPassword,
          role: invitation.role,
          orgId: invitation.orgId,
          emailVerified: new Date(), // Auto-vérifier l'email pour les invitations
          settings: {
            notifications: {
              email: true,
              sms: false,
            },
            preferences: {
              timezone: "Europe/Paris",
              language: "fr",
              currency: "EUR",
            },
          },
        },
      });

      // Marquer l'invitation comme acceptée
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
          acceptedById: user.id,
        },
      });

      // Logger l'action
      await logTenantAction({
        tenantId: invitation.orgId,
        userId: user.id,
        action: "ACCEPT_INVITATION",
        entity: "user",
        entityId: user.id,
        metadata: {
          invitedBy: invitation.invitedBy.email,
          role: invitation.role,
        },
        ipAddress,
        userAgent,
      });

      return createSuccessResponse(
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          organization: {
            id: invitation.organization.id,
            name: invitation.organization.name,
            slug: invitation.organization.slug,
          },
          loginUrl: `http://${invitation.organization.slug}.localhost:3000/login`,
          dashboardUrl: `http://${invitation.organization.slug}.localhost:3000/home`,
        },
        "Invitation acceptée avec succès"
      );
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'invitation:", error);
      return createErrorResponse(
        "INTERNAL_SERVER_ERROR",
        500,
        "Erreur lors de l'acceptation de l'invitation."
      );
    }
  }
);

// GET /api/invitations/validate?token=xxx - Valider une invitation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return createErrorResponse("MISSING_TOKEN", 400, "Token requis.");
  }

  try {
    const invitation = await prisma.invitation.findFirst({
      where: {
        token: token,
        status: "PENDING",
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return createErrorResponse(
        "INVITATION_NOT_FOUND",
        404,
        "Invitation non trouvée."
      );
    }

    if (invitation.expiresAt < new Date()) {
      return createErrorResponse(
        "INVITATION_EXPIRED",
        410,
        "Cette invitation a expiré."
      );
    }

    return createSuccessResponse({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        message: invitation.message,
        expiresAt: invitation.expiresAt,
        organization: invitation.organization,
        invitedBy: invitation.invitedBy,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la validation de l'invitation:", error);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      500,
      "Erreur lors de la validation de l'invitation."
    );
  }
}
