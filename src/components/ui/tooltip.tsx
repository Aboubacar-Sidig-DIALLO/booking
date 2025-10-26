"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Base styles with modern design
      "z-50 overflow-hidden rounded-xl border bg-white/95 px-4 py-3 text-sm text-gray-900 shadow-2xl",

      // Advanced backdrop effects for depth
      "backdrop-blur-xl backdrop-saturate-150",

      // Sophisticated gradient background
      "border-gray-200/50 bg-gradient-to-br from-white via-white to-gray-50/80",

      // Professional entrance animations with smooth easing
      "animate-in fade-in-0 zoom-in-98 slide-in-from-bottom-1",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-98 data-[state=closed]:slide-out-to-bottom-1",

      // Directional slide animations for all sides
      "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
      "data-[side=bottom]:slide-out-to-top-1 data-[side=left]:slide-out-to-right-1 data-[side=right]:slide-out-to-left-1 data-[side=top]:slide-out-to-bottom-1",

      // Professional timing with cubic-bezier easing
      "duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",

      // Responsive sizing
      "max-w-xs",

      // Subtle hover effects for interactivity
      "hover:shadow-3xl hover:scale-[1.02] transition-all duration-200",

      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn(
      "fill-white/95 drop-shadow-sm",
      "transition-all duration-150",
      className
    )}
    {...props}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
};
