"use client";

import { cn } from "@/lib/utils";

interface BrandNameProps {
  variant?: "primary" | "secondary" | "accent" | "light";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  animated?: boolean;
  glow?: boolean;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const variantClasses = {
  primary: "brand-name-primary",
  secondary: "brand-name-secondary",
  accent: "brand-name-accent",
  light: "brand-name-light",
};

export function BrandName({
  variant = "primary",
  size = "lg",
  className,
  animated = true,
  glow = false,
}: BrandNameProps) {
  return (
    <span
      className={cn(
        "font-black tracking-tight drop-shadow-sm transition-all duration-300 cursor-default",
        sizeClasses[size],
        variantClasses[variant],
        animated && "brand-name",
        glow && "brand-name-glow",
        className
      )}
    >
      BookSpace
    </span>
  );
}
