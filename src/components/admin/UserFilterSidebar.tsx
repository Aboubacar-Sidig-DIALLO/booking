"use client";

import { useMemo } from "react";
import { Users, CheckCircle, Clock } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface UserFilterSidebarProps {
  userFilter: "all" | "active" | "inactive";
  setUserFilter: (filter: "all" | "active" | "inactive") => void;
  users: any[];
}

export function UserFilterSidebar({
  userFilter,
  setUserFilter,
  users,
}: UserFilterSidebarProps) {
  const totalCount = users.length;
  const activeCount = users.filter((user) => user.status === "active").length;
  const inactiveCount = users.filter((user) => user.status !== "active").length;

  const filterOptions = useMemo(
    () => [
      {
        value: "all",
        label: "Total",
        count: totalCount,
        color: {
          bg: "bg-purple-100",
          border: "border-purple-100",
          hoverBorder: "hover:border-purple-300",
          activeBorder: "border-purple-500",
          activeBg: "bg-purple-50",
          text: "text-purple-600",
          activeText: "text-purple-700",
          count: "text-purple-900",
        },
      },
      {
        value: "active",
        label: "Actifs",
        icon: CheckCircle,
        count: activeCount,
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
        value: "inactive",
        label: "Inactifs",
        icon: Clock,
        count: inactiveCount,
        color: {
          bg: "bg-gray-100",
          border: "border-gray-200",
          hoverBorder: "hover:border-gray-400",
          activeBorder: "border-gray-500",
          activeBg: "bg-gray-50",
          text: "text-gray-600",
          activeText: "text-gray-900",
          count: "text-gray-900",
        },
      },
    ],
    [totalCount, activeCount, inactiveCount]
  );

  return (
    <FilterSidebar
      title="Filtres"
      icon={Users}
      options={filterOptions}
      selectedValue={userFilter}
      onSelect={(value) =>
        setUserFilter(value as "all" | "active" | "inactive")
      }
      gradientFrom="from-purple-50"
      gradientTo="to-violet-50"
    />
  );
}
