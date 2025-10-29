"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  count: number;
  color: {
    bg: string;
    border: string;
    hoverBorder: string;
    activeBorder: string;
    activeBg: string;
    text: string;
    activeText: string;
    count: string;
  };
}

interface FilterSidebarProps {
  title: string;
  icon: LucideIcon;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  gradientFrom?: string;
  gradientTo?: string;
}

export function FilterSidebar({
  title,
  icon: Icon,
  options,
  selectedValue,
  onSelect,
  gradientFrom = "from-blue-50",
  gradientTo = "to-indigo-50",
}: FilterSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className={cn(
        "bg-gradient-to-br",
        gradientFrom,
        gradientTo,
        "border border-indigo-200 rounded-xl p-5 sticky top-4"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-white rounded-lg">
            <Icon className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>

        <div className="space-y-2.5">
          {options.map((option, index) => {
            const isSelected = selectedValue === option.value;
            const OptionIcon = option.icon;

            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => onSelect(option.value)}
                className={cn(
                  "bg-white rounded-lg p-3.5 border-2 cursor-pointer transition-all duration-200 hover:shadow-md group",
                  isSelected
                    ? `${option.color.activeBorder} ${option.color.activeBg} shadow-md`
                    : `${option.color.border} hover:${option.color.hoverBorder}`
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {OptionIcon && (
                      <div
                        className={cn(
                          "p-1.5 rounded-md",
                          isSelected
                            ? option.color.bg
                            : "bg-gray-50 group-hover:bg-gray-100"
                        )}
                      >
                        <OptionIcon
                          className={cn(
                            "h-4 w-4",
                            isSelected
                              ? option.color.text
                              : "text-gray-600 group-hover:text-gray-700"
                          )}
                        />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSelected
                          ? option.color.activeText
                          : "text-slate-600 group-hover:text-slate-700"
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                  <motion.span
                    className={cn(
                      "text-xl font-bold",
                      isSelected ? option.color.count : "text-slate-700"
                    )}
                    animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {option.count}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
