"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItemText = SelectPrimitive.ItemText;

export function SelectTrigger({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "inline-flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 dark:border-neutral-700",
        className
      )}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

export const SelectContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-md border border-neutral-200 bg-white text-sm shadow-md dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

export function SelectItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-neutral-800"
      )}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
