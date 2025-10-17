import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const styles: Record<Variant, string> = {
    default: "bg-neutral-900 text-white dark:bg-white dark:text-black",
    secondary:
      "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white",
    outline:
      "border border-neutral-300 text-neutral-900 dark:border-neutral-700 dark:text-white",
  };
  return (
    <span className={cn(base, styles[variant], className)}>{children}</span>
  );
}

export default Badge;
