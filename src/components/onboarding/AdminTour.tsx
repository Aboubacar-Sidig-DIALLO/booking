"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function AdminTour() {
  const [shouldShowTour, setShouldShowTour] = useState(true);

  const completeTour = useCallback(() => {
    setShouldShowTour(false);
    localStorage.setItem("admin-tour-completed", "true");
  }, []);
  const tourRef = useRef<any>(null);

  useEffect(() => {
    if (!shouldShowTour) return;

    // Import dynamique de shepherd.js pour éviter les problèmes SSR
    const initTour = async () => {
      const Shepherd = (await import("shepherd.js")).default;

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: "shepherd-theme-modern",
          scrollTo: { behavior: "smooth", block: "center" },
          cancelIcon: {
            enabled: true,
          },
          modalOverlayOpeningPadding: 10,
          modalOverlayOpeningRadius: 8,
        },
      });

      // Étape 1: Statistiques principales
      tour.addStep({
        id: "stats-overview",
        title: "🎯 Bienvenue dans votre tableau de bord",
        text: `
          <div class="space-y-3">
            <p class="text-slate-700 leading-relaxed">
              Voici votre centre de contrôle principal ! Vous y trouverez toutes les métriques importantes de votre organisation.
            </p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-sm text-blue-800">
                💡 <strong>Astuce :</strong> Ces statistiques se mettent à jour en temps réel pour vous donner une vue d'ensemble instantanée.
              </p>
            </div>
          </div>
        `,
        attachTo: {
          element: "[data-tour='stats-overview']",
          on: "bottom",
        },
        buttons: [
          {
            text: "Commencer la visite",
            action: tour.next,
            classes: "shepherd-button-primary",
          },
        ],
      });

      // Étape 2: Navigation par onglets
      tour.addStep({
        id: "navigation-tabs",
        title: "🧭 Navigation intuitive",
        text: `
          <div class="space-y-3">
            <p class="text-slate-700 leading-relaxed">
              Naviguez facilement entre les différentes sections de votre espace d'administration.
            </p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="bg-slate-50 p-2 rounded">
                <strong>📈 Vue d'ensemble</strong><br>
                <span class="text-slate-600">Métriques et statistiques</span>
              </div>
              <div class="bg-slate-50 p-2 rounded">
                <strong>🏢 Salles</strong><br>
                <span class="text-slate-600">Gestion des espaces</span>
              </div>
              <div class="bg-slate-50 p-2 rounded">
                <strong>👥 Utilisateurs</strong><br>
                <span class="text-slate-600">Gestion des membres</span>
              </div>
              <div class="bg-slate-50 p-2 rounded">
                <strong>⚙️ Système</strong><br>
                <span class="text-slate-600">Configuration</span>
              </div>
            </div>
          </div>
        `,
        attachTo: {
          element: "[data-tour='navigation-tabs']",
          on: "bottom",
        },
        buttons: [
          {
            text: "Précédent",
            action: tour.back,
            classes: "shepherd-button-secondary",
          },
          {
            text: "Suivant",
            action: tour.next,
            classes: "shepherd-button-primary",
          },
        ],
      });

      // Étape 3: Ajouter une salle
      tour.addStep({
        id: "add-room",
        title: "🏢 Créer votre première salle",
        text: `
          <div class="space-y-3">
            <p class="text-slate-700 leading-relaxed">
              Commencez par ajouter vos espaces de travail. Vous pourrez configurer leur capacité, équipements et disponibilité.
            </p>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-sm text-green-800">
                ✨ <strong>Fonctionnalités :</strong> Capacité, équipements, horaires d'ouverture, règles de réservation...
              </p>
            </div>
          </div>
        `,
        attachTo: {
          element: "[data-tour='add-room']",
          on: "left",
        },
        buttons: [
          {
            text: "Précédent",
            action: tour.back,
            classes: "shepherd-button-secondary",
          },
          {
            text: "Suivant",
            action: tour.next,
            classes: "shepherd-button-primary",
          },
        ],
      });

      // Étape 4: Gestion des utilisateurs
      tour.addStep({
        id: "user-management",
        title: "👥 Inviter votre équipe",
        text: `
          <div class="space-y-3">
            <p class="text-slate-700 leading-relaxed">
              Invitez vos collègues et définissez leurs rôles et permissions pour une collaboration optimale.
            </p>
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p class="text-sm text-purple-800">
                🔐 <strong>Sécurité :</strong> Contrôlez qui peut réserver quoi et quand avec notre système de permissions granulaire.
              </p>
            </div>
          </div>
        `,
        attachTo: {
          element: "[data-tour='user-management']",
          on: "left",
        },
        buttons: [
          {
            text: "Précédent",
            action: tour.back,
            classes: "shepherd-button-secondary",
          },
          {
            text: "Suivant",
            action: tour.next,
            classes: "shepherd-button-primary",
          },
        ],
      });

      // Étape 5: Paramètres système
      tour.addStep({
        id: "system-settings",
        title: "⚙️ Configuration avancée",
        text: `
          <div class="space-y-3">
            <p class="text-slate-700 leading-relaxed">
              Surveillez l'état de votre système, la sécurité et les performances. Tout fonctionne parfaitement !
            </p>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p class="text-sm text-orange-800">
                📊 <strong>Monitoring :</strong> Surveillance en temps réel des performances et de la sécurité.
              </p>
            </div>
          </div>
        `,
        attachTo: {
          element: "[data-tour='system-settings']",
          on: "left",
        },
        buttons: [
          {
            text: "Précédent",
            action: tour.back,
            classes: "shepherd-button-secondary",
          },
          {
            text: "Terminer la visite",
            action: () => {
              tour.complete();
              completeTour();
            },
            classes: "shepherd-button-primary",
          },
        ],
      });

      // Étape finale
      tour.addStep({
        id: "tour-complete",
        title: "🎉 Félicitations !",
        text: `
          <div class="space-y-4 text-center">
            <div class="text-6xl">🚀</div>
            <p class="text-slate-700 leading-relaxed text-lg">
              Vous êtes maintenant prêt à utiliser{" "}
              <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                BookSpace
              </span>{" "}
              ! 
            </p>
            <p class="text-slate-600">
              N'hésitez pas à explorer les différentes fonctionnalités et à personnaliser votre espace selon vos besoins.
            </p>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-800">
                💡 <strong>Besoin d'aide ?</strong> Consultez notre documentation ou contactez notre support.
              </p>
            </div>
          </div>
        `,
        buttons: [
          {
            text: "Commencer à utiliser BookSpace",
            action: () => {
              tour.complete();
              completeTour();
            },
            classes: "shepherd-button-primary",
          },
        ],
      });

      tourRef.current = tour;
      tour.start();
    };

    initTour();

    return () => {
      if (tourRef.current) {
        tourRef.current.complete();
      }
    };
  }, [shouldShowTour, completeTour]);

  return null;
}
