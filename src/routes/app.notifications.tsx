import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/logic";
import { useStudentStore } from "@/lib/store";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Student Portal" },
      {
        name: "description",
        content:
          "Announcements from your teacher, grading updates, wallet activity and access reminders.",
      },
      { property: "og:title", content: "Notifications — Mathematics Academy" },
      {
        property: "og:description",
        content: "Teacher announcements, grades and wallet updates in one place.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, markAllRead, markNotificationRead } =
    useStudentStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "You are all caught up."}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        )}
      </header>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet." />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => markNotificationRead(n.id)}
                className={`grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-secondary/60 ${
                  n.read ? "border-border bg-card" : "border-accent/50 bg-accent/5"
                }`}
              >
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/40" : "bg-accent"}`}
                />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{n.title}</span>
                    <StatusBadge tone="muted">Update</StatusBadge>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {n.message}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {formatDateTime(n.date)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
