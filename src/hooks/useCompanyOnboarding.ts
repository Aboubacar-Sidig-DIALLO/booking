"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useCompanyOnboarding() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkOrganizationStatus = async () => {
      if (status === "loading" || !session?.user?.email) {
        setIsLoading(true);
        return;
      }

      try {
        // Vérifier si l'utilisateur a une organisation
        const response = await fetch("/api/user/organization");
        if (response.ok) {
          const data = await response.json();
          setHasOrganization(!!data.organization);
          setOnboardingCompleted(!!data.organization?.onboardingCompletedAt);
        } else {
          setHasOrganization(false);
          setOnboardingCompleted(false);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'organisation:",
          error
        );
        setHasOrganization(false);
        setOnboardingCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOrganizationStatus();
  }, [session, status]);

  const needsCompanyOnboarding = hasOrganization === false;
  const isReady = !isLoading && status !== "loading";

  return {
    isLoading,
    hasOrganization,
    onboardingCompleted,
    needsCompanyOnboarding,
    isReady,
  };
}

export function useAdminTour() {
  const [hasSeenTour, setHasSeenTour] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le tour
    const seen = localStorage.getItem("reservapp-admin-tour-seen");
    const hasSeen = seen === "true";

    setHasSeenTour(hasSeen);
    setIsReady(true);
  }, []);

  const shouldShowTour = isReady && hasSeenTour === false;

  const completeTour = () => {
    localStorage.setItem("reservapp-admin-tour-seen", "true");
    setHasSeenTour(true);
  };

  const resetTour = () => {
    localStorage.removeItem("reservapp-admin-tour-seen");
    setHasSeenTour(false);
  };

  return {
    hasSeenTour,
    shouldShowTour,
    isReady,
    completeTour,
    resetTour,
  };
}
