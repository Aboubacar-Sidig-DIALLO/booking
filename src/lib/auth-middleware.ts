import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, token: any) => Promise<NextResponse>
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Non autorisé - Connexion requise" },
        { status: 401 }
      );
    }

    return await handler(request, token);
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return NextResponse.json(
      { error: "Erreur d'authentification" },
      { status: 500 }
    );
  }
}

export function createAuthError(
  message: string = "Non autorisé",
  status: number = 401
) {
  return NextResponse.json({ error: message }, { status });
}
