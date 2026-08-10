import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Button asChild className="mt-5">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
