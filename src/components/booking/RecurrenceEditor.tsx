"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Repeat, Calendar, Clock, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function RecurrenceEditor({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (v: string | null) => void;
}) {
  const [showExamples, setShowExamples] = useState(false);

  const commonPatterns = [
    {
      label: "Quotidien (5 jours)",
      rrule: "FREQ=DAILY;COUNT=5",
      description: "Tous les jours pendant 5 jours",
    },
    {
      label: "Hebdomadaire (10 semaines)",
      rrule: "FREQ=WEEKLY;COUNT=10",
      description: "Chaque semaine pendant 10 semaines",
    },
    {
      label: "Mensuel (6 mois)",
      rrule: "FREQ=MONTHLY;COUNT=6",
      description: "Chaque mois pendant 6 mois",
    },
    {
      label: "Lundi et Mercredi",
      rrule: "FREQ=WEEKLY;BYDAY=MO,WE;COUNT=8",
      description: "Tous les lundis et mercredis",
    },
    {
      label: "Premier lundi du mois",
      rrule: "FREQ=MONTHLY;BYDAY=1MO;COUNT=12",
      description: "Premier lundi de chaque mois",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Repeat className="h-4 w-4 text-slate-600" />
          <Label className="text-sm font-medium text-slate-700">
            Règle de récurrence (RRULE)
          </Label>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowExamples(!showExamples)}
          className="text-slate-500 hover:text-slate-700"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          {showExamples ? "Masquer" : "Exemples"}
        </Button>
      </div>

      <Input
        placeholder="Ex: FREQ=WEEKLY;COUNT=10"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="h-12 bg-white border-slate-200 rounded-xl font-mono text-sm"
      />

      {!value && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Récurrence unique
              </h4>
              <p className="text-sm text-blue-700">
                Cette réservation n&apos;aura lieu qu&apos;une seule fois.
                Laissez le champ vide ou utilisez les exemples ci-dessous pour
                créer une série.
              </p>
            </div>
          </div>
        </div>
      )}

      {showExamples && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h4 className="font-medium text-slate-900 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Exemples de règles RRULE
          </h4>
          <div className="space-y-3">
            {commonPatterns.map((pattern, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border border-slate-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                onClick={() => onChange(pattern.rrule)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm sm:text-base">
                      {pattern.label}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pattern.description}
                    </div>
                  </div>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono whitespace-nowrap sm:whitespace-normal">
                    {pattern.rrule}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h5 className="font-medium text-amber-900 mb-2">💡 Format RRULE</h5>
            <div className="text-xs sm:text-sm text-amber-800 space-y-1">
              <div className="flex flex-wrap gap-2">
                <code className="bg-amber-100 px-1 rounded">FREQ</code>
                <span>: Fréquence (DAILY, WEEKLY, MONTHLY)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <code className="bg-amber-100 px-1 rounded">COUNT</code>
                <span>: Nombre d&apos;occurrences</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <code className="bg-amber-100 px-1 rounded">BYDAY</code>
                <span>: Jours de la semaine (MO, TU, WE, TH, FR, SA, SU)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <code className="bg-amber-100 px-1 rounded">INTERVAL</code>
                <span>: Intervalle entre les occurrences</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {value && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-start space-x-3">
            <Repeat className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">
                Série configurée
              </h4>
              <p className="text-sm text-green-700 mb-2">
                Cette réservation se répétera selon la règle définie.
              </p>
              <code className="text-xs bg-green-100 px-2 py-1 rounded text-green-800">
                {value}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
