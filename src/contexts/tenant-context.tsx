"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Tenant, TenantContextType } from "@/types/tenant";

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveTenantFromRequest = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les informations du tenant depuis les headers
        const response = await fetch("/api/tenant/current", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const tenantData = await response.json();
          setTenant(tenantData);
        } else if (response.status === 404) {
          // Aucun tenant trouvé, rediriger vers la sélection
          setTenant(null);
        } else {
          throw new Error("Erreur lors de la récupération du tenant");
        }
      } catch (err) {
        console.error("Erreur lors de la résolution du tenant:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setTenant(null);
      } finally {
        setIsLoading(false);
      }
    };

    resolveTenantFromRequest();
  }, []);

  const value: TenantContextType = {
    tenant,
    setTenant,
    isLoading,
    error,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

// Hook pour vérifier si une fonctionnalité est activée
export function useFeature(featureName: string): boolean {
  const { tenant } = useTenant();

  if (!tenant) return false;

  return tenant.features.some(
    (orgFeature) =>
      orgFeature.feature.name === featureName && orgFeature.isEnabled
  );
}

// Hook pour récupérer les paramètres d'une fonctionnalité
export function useFeatureSettings(featureName: string): any {
  const { tenant } = useTenant();

  if (!tenant) return null;

  const orgFeature = tenant.features.find(
    (f) => f.feature.name === featureName && f.isEnabled
  );

  return orgFeature?.settings || null;
}

// Hook pour récupérer les paramètres du tenant
export function useTenantSettings(): any {
  const { tenant } = useTenant();
  return tenant?.settings || {};
}

// Hook pour vérifier le plan du tenant
export function useTenantPlan(): string | null {
  const { tenant } = useTenant();
  return tenant?.plan || null;
}
