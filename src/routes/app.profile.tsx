import { createFileRoute } from "@tanstack/react-router";
import { LogOut, ShieldCheck, Smartphone } from "lucide-react";

import { StudentQrCode } from "@/components/StudentQrCode";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { EGP, formatDate } from "@/lib/logic";
import { useStudentStore } from "@/lib/store";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Student Portal" },
      {
        name: "description",
        content:
          "Your student details, education level, locked device and attendance QR code.",
      },
      { property: "og:title", content: "Profile — Mathematics Academy" },
      {
        property: "og:description",
        content: "Student ID, level, locked device and attendance QR code.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { student, balance, purchases, logout } = useStudentStore();
  if (!student) return null;

  const fields = [
    { label: "Student ID", value: student.studentId },
    { label: "Full name", value: student.fullName },
    { label: "Phone number", value: student.phone },
    { label: "Parent phone", value: student.parentPhone },
    { label: "Education level", value: student.level },
    { label: "Governorate", value: student.governorate },
    
    { label: "Wallet balance", value: EGP(balance) },
    { label: "Purchased sessions", value: String(purchases.length) },
  ];

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact the admin to change any of these details.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="size-4" /> Log out
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-base font-semibold">Student details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 grid gap-3 rounded-xl border border-border bg-secondary/40 p-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                <Smartphone className="size-3.5" /> Locked device
              </p>
              <p className="mt-0.5 truncate text-sm font-medium">
                {student.deviceId ? "Locked to this device" : "Not locked yet"}
              </p>
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Account status
              </p>
              <StatusBadge
                tone={student.status === "approved" ? "success" : "warning"}
                className="mt-1"
              >
                {student.status === "approved" ? "Approved" : "Pending approval"}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Your account works on one device only. To move to a new phone or laptop, ask
              the admin to reset your device lock.
            </p>
          </div>
        </section>

        <StudentQrCode studentId={student.studentId} />
      </div>
    </div>
  );
}
