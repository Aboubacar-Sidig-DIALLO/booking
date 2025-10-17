import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelPrimitive.LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-sm font-medium text-neutral-700 dark:text-neutral-200",
        className
      )}
      {...props}
    />
  );
}

export default Label;
