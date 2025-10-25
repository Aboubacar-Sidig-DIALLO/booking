import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { resolveTenantEdge } from "@/lib/tenant-resolver-edge";

export async function middleware(request: NextRequest) {
  const { tenantId, tenantSlug, tenantPlan } = await resolveTenantEdge(request);
  const pathname = request.nextUrl.pathname;

  // Routes API - Ajouter les informations du tenant
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    if (tenantId) {
      response.headers.set("x-tenant-id", tenantId);
      response.headers.set("x-tenant-slug", tenantSlug || "");
      response.headers.set("x-tenant-plan", tenantPlan || "STARTER");
    }

    return response;
  }

  // Vérifier l'authentification pour les routes protégées
  if (!isPublicRoute(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Si pas de token (non connecté), rediriger vers la connexion
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Si l'utilisateur doit changer son mot de passe et n'est pas sur la page de changement
    if (token.mustChangePassword && pathname !== "/change-password") {
      return NextResponse.redirect(new URL("/change-password", request.url));
    }

    // Si l'utilisateur n'a pas besoin de changer son mot de passe mais est sur la page de changement
    if (!token.mustChangePassword && pathname === "/change-password") {
      // Rediriger selon le rôle de l'utilisateur
      const userRole = (token as any)?.role;
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/home", request.url));
      }
    }

    // Vérifier l'accès à la page admin
    if (pathname.startsWith("/admin")) {
      const userRole = (token as any)?.role;
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/home", request.url));
      }
    }
  }

  // Redirection pour les pages publiques si aucun tenant trouvé
  if (!tenantId && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL("/tenant-selection", request.url));
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
    // Page d'accueil (hero)
    "/",

    // Authentification
    "/signin",
    "/error",

    // Processus d'onboarding complet
    "/tenant-selection",
    "/onboarding",
    "/setup", // Configuration initiale

    // Invitations (accessibles sans connexion)
    "/invitation",

    // Gestion des mots de passe
    "/forgot-password",
    "/reset-password",
    "/change-password", // Première modification de mot de passe

    // Pages publiques (optionnelles)
    "/pricing",
    "/about",
    "/contact",
    "/legal",
    "/privacy",
    "/terms",
    "/multitenant-demo",

    // Fichiers statiques
    "/favicon.ico",
    "/_next",
    "/api/auth", // Routes d'authentification NextAuth
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
