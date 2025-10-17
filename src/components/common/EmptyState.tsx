import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-4 flex justify-center">{action}</div>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyStateTryAgain({ onClick }: { onClick: () => void }) {
  return (
    <EmptyState
      title="Aucun résultat"
      description="Essayez d’ajuster vos filtres."
      action={<Button onClick={onClick}>Réessayer</Button>}
    />
  );
}

export default EmptyState;
