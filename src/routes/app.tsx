import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { useStudentStore } from "@/lib/store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { student, hydrated } = useStudentStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !student) void navigate({ to: "/", replace: true });
  }, [hydrated, student, navigate]);

  if (!hydrated || !student) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
