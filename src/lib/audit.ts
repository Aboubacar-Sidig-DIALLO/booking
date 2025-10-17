import { prisma } from "@/lib/db";

export async function logAudit(params: {
  orgId: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: unknown;
}) {
  try {
    await prisma.auditLog.create({
      data: { ...params, metadata: params.metadata as any },
    });
  } catch {}
}
