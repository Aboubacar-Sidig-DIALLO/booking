import { NextRequest, NextResponse } from "next/server";
import { resolveTenant } from "@/lib/tenant-resolver";

export async function GET(request: NextRequest) {
  try {
    const { tenant } = await resolveTenant(request);

    if (!tenant) {
      return NextResponse.json(
        { error: "Aucun tenant trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Erreur lors de la récupération du tenant:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
