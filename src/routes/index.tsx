import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
  Sigma,
  Smartphone,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentStore } from "@/lib/store";
import { LEVELS, type Level } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Mathematics Academy Student Portal" },
      {
        name: "description",
        content:
          "Sign in to your student account to access purchased mathematics sessions, tests, homework and your wallet.",
      },
      { property: "og:title", content: "Mathematics Academy — Student Portal" },
      {
        property: "og:description",
        content:
          "Sign in to study mathematics sessions, take tests and manage your wallet.",
      },
    ],
  }),
  component: AuthPage,
});

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Sharqia",
  "Qalyubia",
  "Beheira",
  "Aswan",
  "Assiut",
];

function AuthPage() {
  const { student, hydrated } = useStudentStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && student) void navigate({ to: "/app", replace: true });
  }, [hydrated, student, navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="surface-hero relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-primary-foreground/10">
            <Sigma className="size-5" />
          </span>
          <div className="text-sm font-semibold leading-tight">
            Mr. Kamal
            <span className="block text-xs font-normal opacity-70">
              Mathematics Academy
            </span>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-balance-tight text-4xl font-semibold leading-tight">
            One place for every session, test and homework you own.
          </h1>
          <p className="mt-4 text-sm leading-relaxed opacity-80">
            Purchase sessions with your wallet, study videos and PDFs in order, take
            your one-attempt tests and follow your grades — all under your assigned
            academic level.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {[
              { icon: ShieldCheck, text: "Admin-approved accounts only" },
              { icon: Smartphone, text: "One authorized device per student" },
              { icon: Lock, text: "Content unlocked strictly in order" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 opacity-90">
                <item.icon className="size-4" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs opacity-60">
          Secondary & preparatory mathematics · English interface
        </p>
      </aside>

      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sigma className="size-5" />
            </span>
            <div className="text-sm font-semibold leading-tight">
              Mr. Kamal
              <span className="block text-xs font-normal text-muted-foreground">
                Mathematics Academy
              </span>
            </div>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { login } = useStudentStore();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("01012345678");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const result = login(identifier, password);
      setLoading(false);
      if (result.ok) void navigate({ to: "/app" });
      else setError({ code: result.code, message: result.message });
    }, 450);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with the phone number or Student ID registered with the academy.
        </p>
      </div>

      {error && (
        <Alert variant={error.code === "invalid" ? "destructive" : "default"}>
          <AlertCircle className="size-4" />
          <AlertTitle>
            {error.code === "pending"
              ? "Account pending approval"
              : error.code === "device"
                ? "Device not authorized"
                : "Sign in failed"}
          </AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="identifier">Phone number or Student ID</Label>
        <Input
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="01012345678"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </Button>

      <p className="rounded-lg border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
        Demo account — phone <span className="font-semibold">01012345678</span>, password{" "}
        <span className="font-semibold">123456</span>. Your first sign-in registers this
        browser as your one authorized device.
      </p>
    </form>
  );
}

function RegisterForm() {
  const { register } = useStudentStore();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    parentPhone: "",
    password: "",
    gender: "Male" as "Male" | "Female",
    governorate: "Cairo",
    level: "3rd Secondary" as Level,
  });

  if (submitted) {
    return (
      <div className="space-y-5">
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertTitle>Account created — pending approval</AlertTitle>
          <AlertDescription>
            Your account is waiting for admin approval. You will be able to log in once
            your account has been approved.
          </AlertDescription>
        </Alert>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Your Student ID</p>
          <p className="mt-1 text-lg font-semibold">{submitted}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Keep your Student ID safe — it identifies you for attendance and support.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const id = register({
          fullName: form.fullName,
          phone: form.phone,
          parentPhone: form.parentPhone,
          password: form.password,
          gender: form.gender,
          governorate: form.governorate,
          level: form.level,
        });
        setSubmitted(id);
      }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl font-semibold">Create your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          New accounts are reviewed by the admin before the first sign-in.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          required
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            required
            inputMode="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parentPhone">Parent phone</Label>
          <Input
            id="parentPhone"
            required
            inputMode="tel"
            value={form.parentPhone}
            onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Level</Label>
          <Select
            value={form.level}
            onValueChange={(v) => setForm({ ...form, level: v as Level })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Governorate</Label>
          <Select
            value={form.governorate}
            onValueChange={(v) => setForm({ ...form, governorate: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOVERNORATES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(v) => setForm({ ...form, gender: v as "Male" | "Female" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Password</Label>
          <Input
            id="newPassword"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
}
