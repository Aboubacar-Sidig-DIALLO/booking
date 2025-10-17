"use client";

import { useState, useEffect } from "react";

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu l'onboarding
    const seen = localStorage.getItem("reservapp-onboarding-seen");
    const hasSeen = seen === "true";

    setHasSeenOnboarding(hasSeen);

    // Si c'est la première visite, activer l'onboarding
    if (!hasSeen) {
      setIsOnboardingActive(true);
    } else {
      setIsOnboardingActive(false);
    }
    setIsReady(true);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("reservapp-onboarding-seen", "true");
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem("reservapp-onboarding-seen");
    setHasSeenOnboarding(false);
    setIsOnboardingActive(true);
  };

  return {
    hasSeenOnboarding,
    isOnboardingActive,
    isReady,
    completeOnboarding,
    resetOnboarding,
  };
}
