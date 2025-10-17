"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;

export function DrawerContent({
  children,
  side = "right",
  className,
}: {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}) {
  const sideClass =
    side === "right"
      ? "right-0 top-0 h-full w-80"
      : side === "left"
        ? "left-0 top-0 h-full w-80"
        : side === "top"
          ? "top-0 left-0 w-full h-64"
          : "bottom-0 left-0 w-full h-64";

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          "fixed z-50 border border-neutral-200 bg-white p-4 shadow-xl outline-none dark:border-neutral-800 dark:bg-neutral-900",
          sideClass,
          className
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
