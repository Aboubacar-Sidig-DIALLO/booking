"use client";

import React from "react";
import {
  Shield,
  Eye,
  Lock,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export type Privacy = "public" | "private" | "confidential";

export default function PrivacySelector({
  value,
  onChange,
}: {
  value: Privacy;
  onChange: (v: Privacy) => void;
}) {
  const privacyOptions = [
    {
      value: "public" as Privacy,
      label: "Publique",
      icon: Eye,
      description: "Visible par tous",
      details:
        "Tous les utilisateurs peuvent voir cette réservation dans le calendrier",
      example: "Réunions d'équipe, formations, événements",
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-800",
      badge: "Recommandé pour les événements d'équipe",
    },
    {
      value: "private" as Privacy,
      label: "Privée",
      icon: Users,
      description: "Participants uniquement",
      details:
        "Seuls les participants peuvent voir les détails de cette réservation",
      example: "Réunions internes, brainstorming, discussions",
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      badge: "Idéal pour les réunions internes",
    },
    {
      value: "confidential" as Privacy,
      label: "Confidentielle",
      icon: Lock,
      description: "Accès restreint",
      details:
        "Seuls les organisateurs et personnes autorisées peuvent accéder",
      example: "Entretiens RH, stratégie, données sensibles",
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-800",
      badge: "Pour les informations sensibles",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Niveau de confidentialité
        </h3>
      </div>

      <p className="text-sm text-slate-600">
        Choisissez qui peut voir cette réservation. Cette option détermine la
        visibilité dans le calendrier partagé.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {privacyOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                isSelected
                  ? `${option.bgColor} ${option.borderColor} shadow-lg scale-105`
                  : `${option.bgColor} ${option.borderColor} hover:shadow-md hover:scale-102`
              }`}
              onClick={() => onChange(option.value)}
            >
              {/* Badge de sélection */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle className="h-4 w-4 text-white" />
                </motion.div>
              )}

              {/* Icône principale */}
              <div
                className={`h-12 w-12 ${option.iconBg} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon className={`h-6 w-6 ${option.iconColor}`} />
              </div>

              {/* Contenu */}
              <div className="space-y-3">
                <div>
                  <h4 className={`font-semibold text-lg ${option.textColor}`}>
                    {option.label}
                  </h4>
                  <p className={`text-sm font-medium ${option.textColor}`}>
                    {option.description}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {option.details}
                </p>

                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    <span className="font-medium">Exemples :</span>{" "}
                    {option.example}
                  </div>

                  <div
                    className={`text-xs text-center px-2 py-1 rounded-full font-medium ${option.iconBg} ${option.iconColor} inline-block`}
                  >
                    {option.badge}
                  </div>
                </div>
              </div>

              {/* Indicateur de sécurité */}
              {option.value === "confidential" && (
                <div className="mt-4 flex items-center space-x-2 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Accès très restreint</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Résumé de la sélection */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 border ${privacyOptions.find((opt) => opt.value === value)?.bgColor} ${privacyOptions.find((opt) => opt.value === value)?.borderColor}`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`h-8 w-8 ${privacyOptions.find((opt) => opt.value === value)?.iconBg} rounded-lg flex items-center justify-center`}
            >
              {React.createElement(
                privacyOptions.find((opt) => opt.value === value)?.icon!,
                {
                  className: `h-4 w-4 ${privacyOptions.find((opt) => opt.value === value)?.iconColor}`,
                }
              )}
            </div>
            <div>
              <h4
                className={`font-semibold ${privacyOptions.find((opt) => opt.value === value)?.textColor}`}
              >
                {privacyOptions.find((opt) => opt.value === value)?.label}{" "}
                sélectionné
              </h4>
              <p className="text-sm text-slate-600">
                {privacyOptions.find((opt) => opt.value === value)?.details}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
