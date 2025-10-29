"use client";

import { useMemo } from "react";
import { BarChart3, CheckCircle, Clock, Wrench } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface RoomFilterSidebarProps {
  roomFilter: "all" | "available" | "occupied" | "maintenance";
  setRoomFilter: (
    filter: "all" | "available" | "occupied" | "maintenance"
  ) => void;
  rooms: any[];
}

export function RoomFilterSidebar({
  roomFilter,
  setRoomFilter,
  rooms,
}: RoomFilterSidebarProps) {
  const totalCount = rooms.length;
  const availableCount = rooms.filter(
    (r) => r.isActive && !r.isOccupied && !r.isMaintenance
  ).length;
  const occupiedCount = rooms.filter(
    (r) => r.isOccupied && !r.isMaintenance
  ).length;
  const maintenanceCount = rooms.filter(
    (r) => r.isMaintenance || !r.isActive
  ).length;

  const filterOptions = useMemo(
    () => [
      {
        value: "all",
        label: "Total",
        count: totalCount,
        color: {
          bg: "bg-blue-100",
          border: "border-blue-100",
          hoverBorder: "hover:border-blue-300",
          activeBorder: "border-blue-500",
          activeBg: "bg-blue-50",
          text: "text-blue-600",
          activeText: "text-blue-700",
          count: "text-blue-900",
        },
      },
      {
        value: "available",
        label: "Disponibles",
        icon: CheckCircle,
        count: availableCount,
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
        value: "occupied",
        label: "Occupées",
        icon: Clock,
        count: occupiedCount,
        color: {
          bg: "bg-orange-100",
          border: "border-orange-200",
          hoverBorder: "hover:border-orange-400",
          activeBorder: "border-orange-500",
          activeBg: "bg-orange-50",
          text: "text-orange-600",
          activeText: "text-orange-900",
          count: "text-orange-900",
        },
      },
      {
        value: "maintenance",
        label: "Maintenance",
        icon: Wrench,
        count: maintenanceCount,
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
    ],
    [totalCount, availableCount, occupiedCount, maintenanceCount]
  );

  return (
    <FilterSidebar
      title="Filtres"
      icon={BarChart3}
      options={filterOptions}
      selectedValue={roomFilter}
      onSelect={(value) =>
        setRoomFilter(value as "all" | "available" | "occupied" | "maintenance")
      }
      gradientFrom="from-blue-50"
      gradientTo="to-indigo-50"
    />
  );
}
