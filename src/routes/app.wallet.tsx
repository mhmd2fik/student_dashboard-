import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Loader2, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EGP, formatDate } from "@/lib/logic";
import { useStudentStore } from "@/lib/store";

export const Route = createFileRoute("/app/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — Student Portal" },
      {
        name: "description",
        content:
          "Check your wallet balance, recharge any amount with Fawry and review every transaction.",
      },
      { property: "og:title", content: "Wallet — Mathematics Academy" },
      {
        property: "og:description",
        content: "Balance, Fawry recharge and full transaction history.",
      },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const { balance, transactions, redeemCode } = useStudentStore();
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const valid = code.trim().length >= 6;

  const redeem = () => {
    setProcessing(true);
    setTimeout(() => {
      const result = redeemCode(code);
      setProcessing(false);
      if (result.ok) {
        setCode("");
        toast.success(
          `Code accepted. ${EGP(result.value ?? 0)} added to your wallet.`,
        );
      } else {
        toast.error(result.message);
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sessions and books are paid from this balance.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
        <section className="surface-hero rounded-2xl p-6 text-primary-foreground sm:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
            <Wallet className="size-4" /> Current balance
          </div>
          <p className="mt-3 text-4xl font-semibold sm:text-5xl">{EGP(balance)}</p>
          <p className="mt-3 max-w-md text-sm opacity-80">
            Buy a recharge code from your teacher, then enter it here. Each code can be
            used once and its value is added to your wallet instantly.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold">Redeem a recharge code</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the code exactly as printed on your card.
          </p>
          <div className="mt-4 space-y-2">
            <Label htmlFor="code">Recharge code</Label>
            <Input
              id="code"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="e.g. 12truuy12uio213hoi"
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
            />
          </div>
          <Button
            className="mt-5 w-full"
            disabled={!valid || processing}
            onClick={() => setConfirm(true)}
          >
            {processing && <Loader2 className="size-4 animate-spin" />}
            Redeem code
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Demo code: 12truuy12uio213hoi (120 EGP).
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-card">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-5">
          <h2 className="text-base font-semibold">Transaction history</h2>
          <StatusBadge tone="muted">{transactions.length} records</StatusBadge>
        </header>

        {transactions.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Receipt} title="No wallet transactions yet." />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance after</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(t.date)}
                      </TableCell>
                      <TableCell>{t.type}</TableCell>
                      <TableCell className="max-w-[260px] truncate">
                        {t.description}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${t.amount > 0 ? "text-success" : "text-destructive"}`}
                      >
                        {t.amount > 0 ? "+" : "−"}
                        {EGP(Math.abs(t.amount))}
                      </TableCell>
                      <TableCell className="text-right">{EGP(t.balanceAfter)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <ul className="divide-y divide-border sm:hidden">
              {transactions.map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.type} · {formatDate(t.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`flex items-center justify-end gap-1 text-sm font-semibold ${t.amount > 0 ? "text-success" : "text-destructive"}`}
                    >
                      {t.amount > 0 ? (
                        <ArrowUpRight className="size-3.5" />
                      ) : (
                        <ArrowDownRight className="size-3.5" />
                      )}
                      {EGP(Math.abs(t.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {EGP(t.balanceAfter)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recharge {EGP(value || 0)} with Fawry?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to Fawry to complete the payment. Your wallet is
              credited only after the payment is confirmed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={pay}>Continue to Fawry</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
