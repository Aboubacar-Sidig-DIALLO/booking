import { NextRequest, NextResponse } from "next/server";
import { resolveTenantEdge } from "@/lib/tenant-resolver-edge";

export async function middleware(request: NextRequest) {
  const { tenantId, tenantSlug, tenantPlan } = await resolveTenantEdge(request);

  // Ajouter les informations du tenant dans les headers pour les routes API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    if (tenantId) {
      response.headers.set("x-tenant-id", tenantId);
      response.headers.set("x-tenant-slug", tenantSlug || "");
      response.headers.set("x-tenant-plan", tenantPlan || "STARTER");
    }

    return response;
  }

  // Redirection pour les pages publiques si aucun tenant trouvé
  if (!tenantId && !isPublicRoute(request.nextUrl.pathname)) {
    // Rediriger vers la page de sélection de tenant ou d'inscription
    return NextResponse.redirect(
      new URL("/auth/tenant-selection", request.url)
    );
  }

  // Ajouter les informations du tenant dans les headers pour les pages
  const response = NextResponse.next();

  if (tenantId) {
    response.headers.set("x-tenant-id", tenantId);
    response.headers.set("x-tenant-slug", tenantSlug || "");
    response.headers.set("x-tenant-plan", tenantPlan || "STARTER");
  }

  return response;
}

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/",
    "/auth",
    "/auth/signin",
    "/auth/signup",
    "/auth/tenant-selection",
    "/pricing",
    "/about",
    "/contact",
    "/legal",
    "/privacy",
    "/terms",
    "/multitenant-demo",
  ];

  return publicRoutes.some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
