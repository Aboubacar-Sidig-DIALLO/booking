import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/rbac";

export async function GET() {
  const sites = await prisma.site.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
  assertCan("MANAGER" as any, "sites:crud");
  const { name, orgId } = await req.json();
  const site = await prisma.site.create({
    data: { name, orgId: orgId ?? "org-demo" },
  });
  return NextResponse.json(site, { status: 201 });
}
