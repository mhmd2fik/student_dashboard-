import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, GraduationCap } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { SessionCard } from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { useStudentStore } from "@/lib/store";

export const Route = createFileRoute("/app/classes/$categoryId")({
  head: () => ({
    meta: [
      { title: "Category sessions — Student Portal" },
      {
        name: "description",
        content: "All sessions published inside this category for your academic level.",
      },
      { property: "og:title", content: "Category sessions — Mathematics Academy" },
      {
        property: "og:description",
        content: "Sessions, prices and access periods inside this category.",
      },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const { categories, sessions } = useStudentStore();
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/app/classes">
            <ChevronLeft className="size-4" /> Classes
          </Link>
        </Button>
        <EmptyState
          icon={GraduationCap}
          title="This category is not available for your level."
          description="You can only open categories that belong to your assigned academic level."
          actionLabel="Back to Classes"
          actionTo="/app/classes"
        />
      </div>
    );
  }

  const list = sessions
    .filter((s) => s.categoryId === category.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/classes">
          <ChevronLeft className="size-4" /> Classes
        </Link>
      </Button>

      <header className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="grid gap-0 sm:grid-cols-[240px_minmax(0,1fr)]">
          <div className="aspect-[16/9] bg-primary-deep sm:aspect-auto">
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              width={1024}
              height={640}
              className="size-full object-cover"
            />
          </div>
          <div className="p-5 sm:p-6">
            <h1 className="text-2xl font-semibold">{category.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            <p className="mt-3 text-sm font-medium text-accent">
              {list.length} session{list.length === 1 ? "" : "s"} · {category.level}
            </p>
          </div>
        </div>
      </header>

      {list.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No sessions published in this category yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}
