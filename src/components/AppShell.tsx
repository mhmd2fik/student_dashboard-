import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  GraduationCap,
  LayoutGrid,
  LibraryBig,
  LogOut,
  Sigma,
  User,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EGP } from "@/lib/logic";
import { useStudentStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV: NavItem[] = [
  { to: "/app", label: "Home", icon: LayoutGrid, exact: true },
  { to: "/app/classes", label: "Classes", icon: GraduationCap },
  { to: "/app/books", label: "Books", icon: BookOpen },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/learning", label: "My Learning", icon: LibraryBig },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { student, balance, unreadCount, logout } = useStudentStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const initials = (student?.fullName ?? "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link to="/app" className="flex shrink-0 items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Sigma className="size-5" />
              </span>
              <span className="hidden text-sm font-semibold leading-tight sm:block">
                Mr. Kamal
                <span className="block text-xs font-normal text-muted-foreground">
                  Mathematics Academy
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                    isActive(item.to, item.exact) && "bg-secondary text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 sm:flex">
              <Wallet className="size-4 text-accent" />
              <span className="text-sm font-semibold">{EGP(balance)}</span>
            </div>

            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/app/notifications" aria-label="Notifications">
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border p-0.5 pr-2 transition-colors hover:bg-secondary">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                    {student?.fullName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="space-y-0.5">
                  <p className="truncate text-sm font-semibold">{student?.fullName}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {student?.level} · {student?.studentId}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/profile">
                    <User className="size-4" /> Profile & QR code
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app/wallet">
                    <Wallet className="size-4" /> Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground",
                  active && "text-accent",
                )}
              >
                <item.icon className="size-5" />
                <span className="truncate px-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
