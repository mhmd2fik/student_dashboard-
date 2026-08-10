import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { useStudentStore } from "@/lib/store";

export const Route = createFileRoute("/app/classes/")({
  head: () => ({
    meta: [
      { title: "Classes — Student Portal" },
      {
        name: "description",
        content:
          "Browse the mathematics categories and sessions published for your academic level.",
      },
      { property: "og:title", content: "Classes — Mathematics Academy" },
      {
        property: "og:description",
        content: "Categories and sessions available for your academic level.",
      },
    ],
  }),
  component: ClassesPage,
});

function ClassesPage() {
  const { student, categories, sessions } = useStudentStore();

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Content is filtered to your assigned level. Choose a category to see its
            sessions.
          </p>
        </div>
        <StatusBadge tone="primary">{student?.level}</StatusBadge>
      </header>

      {categories.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No categories are available for your level yet."
          description="Your teacher has not published content for this level. Check back soon."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const count = sessions.filter((s) => s.categoryId === category.id).length;
            return (
              <Link
                key={category.id}
                to="/app/classes/$categoryId"
                params={{ categoryId: category.id }}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="aspect-[16/9] overflow-hidden bg-primary-deep">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">{category.name}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-accent">
                      {count} session{count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
