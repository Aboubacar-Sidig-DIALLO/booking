import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/rbac";

export async function GET() {
  const features = await prisma.feature.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(features);
}

export async function POST(req: NextRequest) {
  assertCan("MANAGER" as any, "features:crud");
  const { name, icon } = await req.json();
  const feature = await prisma.feature.create({ data: { name, icon } });
  return NextResponse.json(feature, { status: 201 });
}
