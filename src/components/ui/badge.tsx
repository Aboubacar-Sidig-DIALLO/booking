"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "neon"
    | "glass";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "border border-border text-foreground",
  success: "bg-green-500 text-white hover:bg-green-600",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  neon: "neon-primary text-primary bg-transparent",
  glass: "glass text-foreground border-border/50",
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant = "default", size = "md", animated = false, ...props },
    ref
  ) => {
    const badgeContent = (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          animated && "animate-pulse",
          className
        )}
        {...props}
      />
    );

    if (animated) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {badgeContent}
        </motion.div>
      );
    }

    return badgeContent;
  }
);

Badge.displayName = "Badge";

export { Badge };
