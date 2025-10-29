"use client";

import { useMemo } from "react";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface BookingFilterSidebarProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  bookings: any[];
}

export function BookingFilterSidebar({
  selectedStatus,
  setSelectedStatus,
  bookings,
}: BookingFilterSidebarProps) {
  const counts = useMemo(
    () => ({
      all: bookings.length,
      CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
      PENDING: bookings.filter((b) => b.status === "PENDING").length,
      CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
    }),
    [bookings]
  );

  const filterOptions = [
    {
      value: "all",
      label: "Total",
      count: counts.all,
      color: {
        bg: "bg-indigo-100",
        border: "border-indigo-100",
        hoverBorder: "hover:border-indigo-300",
        activeBorder: "border-indigo-500",
        activeBg: "bg-indigo-50",
        text: "text-indigo-600",
        activeText: "text-indigo-700",
        count: "text-indigo-900",
      },
    },
    {
      value: "CONFIRMED",
      label: "Confirmées",
      icon: CheckCircle,
      count: counts.CONFIRMED,
      color: {
        bg: "bg-green-100",
        border: "border-green-200",
        hoverBorder: "hover:border-green-400",
        activeBorder: "border-green-500",
        activeBg: "bg-green-50",
        text: "text-green-600",
        activeText: "text-green-900",
        count: "text-green-900",
      },
    },
    {
      value: "PENDING",
      label: "En attente",
      icon: Clock,
      count: counts.PENDING,
      color: {
        bg: "bg-yellow-100",
        border: "border-yellow-200",
        hoverBorder: "hover:border-yellow-400",
        activeBorder: "border-yellow-500",
        activeBg: "bg-yellow-50",
        text: "text-yellow-600",
        activeText: "text-yellow-900",
        count: "text-yellow-900",
      },
    },
    {
      value: "CANCELLED",
      label: "Annulées",
      icon: XCircle,
      count: counts.CANCELLED,
      color: {
        bg: "bg-red-100",
        border: "border-red-200",
        hoverBorder: "hover:border-red-400",
        activeBorder: "border-red-500",
        activeBg: "bg-red-50",
        text: "text-red-600",
        activeText: "text-red-900",
        count: "text-red-900",
      },
    },
  ];

  return (
    <FilterSidebar
      title="Filtres"
      icon={Calendar}
      options={filterOptions}
      selectedValue={selectedStatus}
      onSelect={setSelectedStatus}
      gradientFrom="from-indigo-50"
      gradientTo="to-blue-50"
    />
  );
}
