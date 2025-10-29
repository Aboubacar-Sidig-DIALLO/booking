"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Timer,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type DateTimeRange = { from: string; to: string };

const TIME_SLOTS = Array.from(
  { length: 48 }, // 24 heures * 2 (créneaux de 30 min)
  (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return (
      hour.toString().padStart(2, "0") +
      ":" +
      minute.toString().padStart(2, "0")
    );
  }
);

const QUICK_DURATIONS = [
  { label: "30 min", minutes: 30 },
  { label: "1h", minutes: 60 },
  { label: "1h30", minutes: 90 },
  { label: "2h", minutes: 120 },
  { label: "4h", minutes: 240 },
];

export function DateTimeRangePicker({
  value,
  onChange,
}: {
  value: DateTimeRange;
  onChange: (v: DateTimeRange) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [viewMode, setViewMode] = useState<"calendar" | "quick">("calendar");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  // Fermer le sélecteur de mois quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthPickerRef.current &&
        !monthPickerRef.current.contains(event.target as Node)
      ) {
        setShowMonthPicker(false);
      }
    };

    if (showMonthPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMonthPicker]);

  // Générer le calendrier du mois
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendar = generateCalendar(selectedDate);
  const today = new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  const isPast = (date: Date) => {
    return date < today && !isToday(date);
  };

  const handleDateSelect = (date: Date) => {
    if (isPast(date)) return;

    setSelectedDate(date);
    updateDateTime(date, startTime, endTime);
  };

  const updateDateTime = (date: Date, start: string, end: string) => {
    const fromDate = new Date(date);
    const [startHour, startMin] = start.split(":");
    fromDate.setHours(parseInt(startHour), parseInt(startMin));

    const toDate = new Date(date);
    const [endHour, endMin] = end.split(":");
    toDate.setHours(parseInt(endHour), parseInt(endMin));

    onChange({
      from: fromDate.toISOString().slice(0, 16),
      to: toDate.toISOString().slice(0, 16),
    });
  };

  const handleQuickDuration = (minutes: number) => {
    const start = new Date(selectedDate);
    const [hour, min] = startTime.split(":");
    start.setHours(parseInt(hour), parseInt(min));

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + minutes);

    const endTimeStr =
      end.getHours().toString().padStart(2, "0") +
      ":" +
      end.getMinutes().toString().padStart(2, "0");

    setEndTime(endTimeStr);
    updateDateTime(selectedDate, startTime, endTimeStr);
  };

  const handleMonthYearChange = (month: number, year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setShowMonthPicker(false);
  };

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Navigation rapide par clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showMonthPicker) return;

      switch (event.key) {
        case "Escape":
          setShowMonthPicker(false);
          break;
        case "ArrowLeft":
          event.preventDefault();
          const prevMonth = new Date(selectedDate);
          prevMonth.setMonth(prevMonth.getMonth() - 1);
          setSelectedDate(prevMonth);
          break;
        case "ArrowRight":
          event.preventDefault();
          const nextMonth = new Date(selectedDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          setSelectedDate(nextMonth);
          break;
      }
    };

    if (showMonthPicker) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMonthPicker, selectedDate]);

  return (
    <div className="space-y-6">
      {/* En-tête avec modes de vue */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Sélection de créneau</h3>
        </div>

        <div className="flex bg-slate-100 rounded-lg p-1">
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className="h-8 px-3 text-xs"
          >
            <CalendarDays className="h-3 w-3 mr-1" />
            Calendrier
          </Button>
          <Button
            variant={viewMode === "quick" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("quick")}
            className="h-8 px-3 text-xs"
          >
            <Timer className="h-3 w-3 mr-1" />
            Rapide
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "calendar" && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Navigation du calendrier */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const prev = new Date(selectedDate);
                    prev.setMonth(prev.getMonth() - 1);
                    setSelectedDate(prev);
                  }}
                  className="h-8 w-8 p-0 hover:bg-white/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="relative" ref={monthPickerRef}>
                  <Button
                    variant="ghost"
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                    className="h-10 px-4 hover:bg-white/50 font-semibold text-slate-900"
                  >
                    <span className="capitalize">
                      {selectedDate.toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ml-2 transition-transform duration-200 ${showMonthPicker ? "rotate-180" : ""}`}
                    />
                  </Button>

                  {/* Sélecteur de mois/année */}
                  <AnimatePresence>
                    {showMonthPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50 min-w-[280px]"
                      >
                        <div className="space-y-4">
                          {/* Sélection de l'année */}
                          <div>
                            <Label className="text-sm font-medium text-slate-700 mb-2 block">
                              Année
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                              {years.map((year) => (
                                <Button
                                  key={year}
                                  variant={
                                    year === selectedDate.getFullYear()
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handleMonthYearChange(
                                      selectedDate.getMonth(),
                                      year
                                    )
                                  }
                                  className="h-8 text-xs"
                                >
                                  {year}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Sélection du mois */}
                          <div>
                            <Label className="text-sm font-medium text-slate-700 mb-2 block">
                              Mois
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                              {months.map((month, index) => (
                                <Button
                                  key={month}
                                  variant={
                                    index === selectedDate.getMonth()
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handleMonthYearChange(
                                      index,
                                      selectedDate.getFullYear()
                                    )
                                  }
                                  className="h-8 text-xs"
                                >
                                  {month.slice(0, 3)}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Navigation rapide */}
                          <div className="pt-2 border-t border-slate-200">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const prev = new Date(selectedDate);
                                  prev.setMonth(prev.getMonth() - 1);
                                  setSelectedDate(prev);
                                }}
                                className="h-8 text-xs"
                              >
                                ← Mois précédent
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const next = new Date(selectedDate);
                                  next.setMonth(next.getMonth() + 1);
                                  setSelectedDate(next);
                                }}
                                className="h-8 text-xs"
                              >
                                Mois suivant →
                              </Button>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const today = new Date();
                                  handleMonthYearChange(
                                    today.getMonth(),
                                    today.getFullYear()
                                  );
                                }}
                                className="flex-1 h-8 text-xs"
                              >
                                Aujourd'hui
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMonthPicker(false)}
                                className="flex-1 h-8 text-xs"
                              >
                                Fermer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = new Date(selectedDate);
                    next.setMonth(next.getMonth() + 1);
                    setSelectedDate(next);
                  }}
                  className="h-8 w-8 p-0 hover:bg-white/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>

            {/* Grille du calendrier */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-xs font-medium text-slate-600"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Jours du calendrier */}
              <div className="grid grid-cols-7">
                {calendar.map((date, index) => {
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString();
                  const isTodayDate = isToday(date);
                  const isCurrentMonth = isSameMonth(date);
                  const isPastDate = isPast(date);

                  return (
                    <motion.button
                      key={index}
                      whileHover={!isPastDate ? { scale: 1.05 } : {}}
                      whileTap={!isPastDate ? { scale: 0.95 } : {}}
                      onClick={() => handleDateSelect(date)}
                      disabled={isPastDate}
                      className={`
                        relative p-3 text-sm transition-all duration-200 border-r border-b border-slate-100
                        ${
                          isSelected
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                            : isTodayDate
                              ? "bg-blue-50 text-blue-700 font-semibold"
                              : isCurrentMonth
                                ? "hover:bg-slate-50 text-slate-900"
                                : "text-slate-400"
                        }
                        ${isPastDate ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      {date.getDate()}
                      {isTodayDate && !isSelected && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                      )}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1"
                        >
                          <Check className="h-3 w-3" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "quick" && (
          <motion.div
            key="quick"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Sélection rapide de date */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Aujourd'hui", date: new Date() },
                {
                  label: "Demain",
                  date: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
                {
                  label: "Après-demain",
                  date: new Date(Date.now() + 48 * 60 * 60 * 1000),
                },
                {
                  label: "Lundi",
                  date: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
                    return d;
                  })(),
                },
              ].map(({ label, date }) => (
                <Button
                  key={label}
                  variant={
                    selectedDate.toDateString() === date.toDateString()
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleDateSelect(date)}
                  className="h-12 text-sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sélection des heures */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-4 w-4 text-green-600" />
          <Label className="font-medium text-slate-900">Horaires</Label>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-sm text-slate-700">Début</Label>
            <select
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                updateDateTime(selectedDate, e.target.value, endTime);
              }}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-slate-700">Fin</Label>
            <select
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                updateDateTime(selectedDate, startTime, e.target.value);
              }}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Durées rapides */}
        <div className="space-y-2">
          <Label className="text-sm text-slate-700">Durées suggérées</Label>
          <div className="flex flex-wrap gap-2">
            {QUICK_DURATIONS.map(({ label, minutes }) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickDuration(minutes)}
                className="h-8 px-3 text-xs hover:bg-green-50 hover:border-green-300"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Résumé de la sélection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 rounded-xl p-4 border border-blue-200"
      >
        <div className="flex items-start space-x-3">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-blue-900 mb-1">
              Créneau sélectionné
            </h4>
            <p className="text-sm text-blue-700">
              <span className="font-medium">{formatDate(selectedDate)}</span>
              <br />
              De {startTime} à {endTime}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DateTimeRangePicker;
