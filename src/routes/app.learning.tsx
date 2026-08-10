import { Link, createFileRoute } from "@tanstack/react-router";
import { LibraryBig } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES } from "@/lib/demo-data";
import { getAccessInfo, getSessionProgress } from "@/lib/logic";
import { useStudentStore } from "@/lib/store";
import type { Purchase, Session } from "@/lib/types";

export const Route = createFileRoute("/app/learning")({
  head: () => ({
    meta: [
      { title: "My Learning — Student Portal" },
      {
        name: "description",
        content:
          "All your purchased sessions grouped by in progress, completed and expired access.",
      },
      { property: "og:title", content: "My Learning — Mathematics Academy" },
      {
        property: "og:description",
        content: "Track progress, grades and access expiry for every purchased session.",
      },
    ],
  }),
  component: LearningPage,
});

function LearningPage() {
  const { purchases, sessions, progress } = useStudentStore();

  const rows = purchases
    .map((purchase) => ({
      purchase,
      session: sessions.find((s) => s.id === purchase.sessionId),
    }))
    .filter((r): r is { purchase: Purchase; session: Session } => Boolean(r.session))
    .map((r) => ({
      ...r,
      access: getAccessInfo(r.purchase),
      p: getSessionProgress(r.session, progress),
    }));

  const expired = rows.filter((r) => r.access.expired);
  const completed = rows.filter((r) => !r.access.expired && r.p.completed);
  const inProgress = rows.filter((r) => !r.access.expired && !r.p.completed);

  const groups = [
    { key: "progress", label: `In Progress (${inProgress.length})`, items: inProgress },
    { key: "completed", label: `Completed (${completed.length})`, items: completed },
    { key: "expired", label: `Expired (${expired.length})`, items: expired },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">My Learning</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you have purchased, with progress and access status.
        </p>
      </header>

      {rows.length === 0 ? (
        <EmptyState
          icon={LibraryBig}
          title="You haven't purchased any sessions yet."
          actionLabel="Explore Classes"
          actionTo="/app/classes"
        />
      ) : (
        <Tabs defaultValue="progress">
          <TabsList>
            {groups.map((g) => (
              <TabsTrigger key={g.key} value={g.key}>
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {groups.map((g) => (
            <TabsContent key={g.key} value={g.key} className="mt-5">
              {g.items.length === 0 ? (
                <EmptyState icon={LibraryBig} title="Nothing here yet." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {g.items.map(({ session, access, p }) => {
                    const category = CATEGORIES.find((c) => c.id === session.categoryId);
                    return (
                      <article
                        key={session.id}
                        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
                      >
                        <div className="flex gap-3">
                          <img
                            src={session.cover}
                            alt={session.name}
                            loading="lazy"
                            width={160}
                            height={160}
                            className="size-16 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              {category?.name}
                            </p>
                            <h2 className="truncate text-sm font-semibold">
                              {session.name}
                            </h2>
                            <StatusBadge
                              tone={access.expired ? "danger" : p.completed ? "success" : "warning"}
                              className="mt-1.5"
                            >
                              {access.expired
                                ? "Expired"
                                : p.completed
                                  ? "Completed"
                                  : access.label}
                            </StatusBadge>
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {p.done}/{p.total} required parts
                            </span>
                            <span className="font-semibold">{p.percent}%</span>
                          </div>
                          <Progress value={p.percent} className="h-1.5" />
                        </div>
                        <Button asChild size="sm" className="mt-auto self-start">
                          <Link
                            to="/app/sessions/$sessionId"
                            params={{ sessionId: session.id }}
                          >
                            {access.expired ? "View details" : "Continue"}
                          </Link>
                        </Button>
                      </article>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
