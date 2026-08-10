import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bell, PlayCircle, Sparkles, Wallet } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { SessionCard } from "@/components/SessionCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/lib/demo-data";
import {
  EGP,
  formatDate,
  getAccessInfo,
  getSessionProgress,
} from "@/lib/logic";
import { useStudentStore } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Home — Student Portal" },
      {
        name: "description",
        content:
          "Your personalised dashboard: wallet balance, sessions in progress, notifications and newly published sessions.",
      },
      { property: "og:title", content: "Student Dashboard — Mathematics Academy" },
      {
        property: "og:description",
        content: "Wallet, progress and newly published sessions for your level.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const {
    student,
    balance,
    sessions,
    purchases,
    progress,
    notifications,
    purchaseOf,
  } = useStudentStore();

  const continueLearning = purchases
    .map((p) => ({ purchase: p, session: sessions.find((s) => s.id === p.sessionId) }))
    .filter((x) => x.session)
    .filter((x) => !getAccessInfo(x.purchase).expired)
    .map((x) => ({ ...x, p: getSessionProgress(x.session!, progress) }))
    .filter((x) => x.p.percent > 0 && x.p.percent < 100)
    .sort((a, b) => b.p.percent - a.p.percent);

  const recommended = sessions
    .filter((s) => !purchaseOf(s.id))
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  const latestNotifications = notifications.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="surface-hero overflow-hidden rounded-2xl p-6 text-primary-foreground sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div className="min-w-0">
            <StatusBadge
              tone="neutral"
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
            >
              {student?.level}
            </StatusBadge>
            <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Welcome back, {student?.fullName.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 max-w-xl text-sm opacity-80">
              You have {continueLearning.length} session
              {continueLearning.length === 1 ? "" : "s"} in progress and{" "}
              {recommended.length} available to explore for your level.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="secondary">
                <Link to="/app/classes">
                  Browse classes <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/app/learning">My Learning</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-5 backdrop-blur">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
              <Wallet className="size-4" /> Wallet balance
            </div>
            <p className="mt-2 text-3xl font-semibold">{EGP(balance)}</p>
            <Button asChild className="mt-4 w-full" variant="secondary">
              <Link to="/app/wallet">Recharge Wallet</Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Continue Learning"
          description="Sessions where you already made progress."
          to="/app/learning"
          linkLabel="View all"
        />
        {continueLearning.length === 0 ? (
          <EmptyState
            icon={PlayCircle}
            title="Nothing in progress right now"
            description="Start a purchased session or explore the classes available for your level."
            actionLabel="Explore Classes"
            actionTo="/app/classes"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {continueLearning.map(({ session, purchase, p }) => {
              const category = CATEGORIES.find((c) => c.id === session!.categoryId);
              const access = getAccessInfo(purchase);
              return (
                <article
                  key={session!.id}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <img
                    src={session!.cover}
                    alt={session!.name}
                    loading="lazy"
                    width={160}
                    height={160}
                    className="size-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {category?.name}
                    </p>
                    <h3 className="truncate text-sm font-semibold">{session!.name}</h3>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{access.label}</span>
                      <span className="font-semibold">{p.percent}%</span>
                    </div>
                    <Progress value={p.percent} className="mt-1.5 h-1.5" />
                    <Button asChild size="sm" className="mt-3 self-start">
                      <Link
                        to="/app/sessions/$sessionId"
                        params={{ sessionId: session!.id }}
                      >
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <SectionHeader
            title="Available for your level"
            description={`Recently published sessions for ${student?.level}.`}
            to="/app/classes"
            linkLabel="All classes"
          />
          {recommended.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="You own every published session"
              description="New sessions for your level will appear here as soon as they are published."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recommended.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          )}
        </div>

        <div>
          <SectionHeader
            title="Notifications"
            to="/app/notifications"
            linkLabel="Open center"
          />
          {latestNotifications.length === 0 ? (
            <EmptyState icon={Bell} title="You're all caught up." />
          ) : (
            <ul className="space-y-3">
              {latestNotifications.map((n) => (
                <li key={n.id}>
                  <Link
                    to="/app/notifications"
                    className="block rounded-xl border border-border bg-card p-4 shadow-card transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold">{n.title}</h3>
                      {!n.read && (
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(n.date)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  to,
  linkLabel,
}: {
  title: string;
  description?: string;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {to && linkLabel && (
        <Button asChild variant="ghost" size="sm">
          <Link to={to}>
            {linkLabel} <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
