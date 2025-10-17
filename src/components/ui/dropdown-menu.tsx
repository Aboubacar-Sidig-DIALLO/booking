"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = Dropdown.Root;
export const DropdownMenuTrigger = Dropdown.Trigger;
export const DropdownMenuGroup = Dropdown.Group;

export function DropdownMenuContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dropdown.Portal>
      <Dropdown.Content
        sideOffset={6}
        className={cn(
          "z-50 min-w-[10rem] rounded-md border border-neutral-200 bg-white p-1 text-sm shadow-md dark:border-neutral-800 dark:bg-neutral-900",
          className
        )}
      >
        {children}
      </Dropdown.Content>
    </Dropdown.Portal>
  );
}

export function DropdownMenuItem({
  children,
  className,
  inset,
  ...props
}: any) {
  return (
    <Dropdown.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-neutral-800",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </Dropdown.Item>
  );
}
