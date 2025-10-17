"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>;
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
  );
}

export function TooltipContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={6}
        className={cn(
          "z-50 rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md will-change-[transform,opacity] data-[state=delayed-open]:data-[side=top]:animate-in",
          "dark:bg-neutral-100 dark:text-neutral-900",
          className
        )}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-neutral-900 dark:fill-neutral-100" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
