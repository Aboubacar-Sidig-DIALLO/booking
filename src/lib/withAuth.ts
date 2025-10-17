import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth(_req: NextRequest) {
  const session: any = await getServerSession(authOptions as any);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }
  return session as any;
}
