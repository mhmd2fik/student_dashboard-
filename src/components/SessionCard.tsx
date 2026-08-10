import { Link } from "@tanstack/react-router";
import { Clock, Lock, PlayCircle, Timer } from "lucide-react";

import { SessionStatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/lib/demo-data";
import {
  EGP,
  formatMinutes,
  getAccessInfo,
  getSessionProgress,
  getSessionStatus,
} from "@/lib/logic";
import { useStudentStore } from "@/lib/store";
import type { Session } from "@/lib/types";

export function SessionCard({ session }: { session: Session }) {
  const { purchaseOf, isSessionPurchased, progress } = useStudentStore();
  const purchase = purchaseOf(session.id);
  const access = getAccessInfo(purchase);
  const prerequisitePurchased = session.prerequisiteSessionId
    ? isSessionPurchased(session.prerequisiteSessionId)
    : true;
  const status = getSessionStatus({
    session,
    ...(purchase ? { purchase } : {}),
    prerequisitePurchased,
    progress,
  });
  const p = getSessionProgress(session, progress);
  const category = CATEGORIES.find((c) => c.id === session.categoryId);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated">
      <Link
        to="/app/sessions/$sessionId"
        params={{ sessionId: session.id }}
        className="relative block aspect-[16/9] overflow-hidden bg-primary-deep"
      >
        <img
          src={session.cover}
          alt={session.name}
          loading="lazy"
          width={1024}
          height={640}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <SessionStatusBadge status={status} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {category?.name}
          </p>
          <h3 className="mt-1 truncate text-base font-semibold">{session.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {session.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {formatMinutes(session.learningMinutes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer className="size-3.5" /> {session.accessDays} days access
          </span>
        </div>

        {access.purchased && !access.expired && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{p.percent}%</span>
            </div>
            <Progress value={p.percent} className="h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">{access.label}</p>
          </div>
        )}
        {access.expired && (
          <p className="text-xs font-medium text-destructive">
            Access expired — contact the admin to renew.
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          {access.purchased ? (
            <span className="text-sm font-semibold text-success">Purchased</span>
          ) : (
            <span className="text-sm font-semibold">{EGP(session.price)}</span>
          )}

          <Button asChild size="sm" variant={access.purchased ? "default" : "secondary"}>
            <Link to="/app/sessions/$sessionId" params={{ sessionId: session.id }}>
              {status === "locked" ? (
                <>
                  <Lock className="size-4" /> Locked
                </>
              ) : access.purchased ? (
                <>
                  <PlayCircle className="size-4" />
                  {access.expired ? "View" : "Continue"}
                </>
              ) : (
                "View details"
              )}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
