import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/lib/logic";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "muted";

const toneClass: Record<Tone, string> = {
  neutral: "bg-secondary text-secondary-foreground border-transparent",
  primary: "bg-accent/12 text-accent border-accent/25",
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/18 text-warning-foreground border-warning/35",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const sessionStatusMap: Record<SessionStatus, { label: string; tone: Tone }> = {
  available: { label: "Available", tone: "primary" },
  locked: { label: "Locked", tone: "muted" },
  purchased: { label: "Purchased", tone: "success" },
  in_progress: { label: "In Progress", tone: "warning" },
  completed: { label: "Completed", tone: "success" },
  expired: { label: "Expired", tone: "danger" },
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const meta = sessionStatusMap[status];
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}
