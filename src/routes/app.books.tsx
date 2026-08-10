import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Download, Truck } from "lucide-react";
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
import { EGP } from "@/lib/logic";
import { useStudentStore } from "@/lib/store";
import type { Book } from "@/lib/types";

export const Route = createFileRoute("/app/books")({
  head: () => ({
    meta: [
      { title: "Books — Student Portal" },
      {
        name: "description",
        content:
          "Buy digital books for instant download or physical books delivered to your address, paid from your wallet.",
      },
      { property: "og:title", content: "Books — Mathematics Academy" },
      {
        property: "og:description",
        content: "Digital and physical mathematics books for your level.",
      },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  const { books } = useStudentStore();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Books</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Only books available for your level are shown.
        </p>
      </header>

      {books.length === 0 ? (
        <EmptyState icon={BookOpen} title="No books are available for your level yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const { balance, isBookPurchased, purchaseBook } = useStudentStore();
  const owned = isBookPurchased(book.id);
  const [confirm, setConfirm] = useState(false);
  const enough = balance >= book.price;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="aspect-[4/3] bg-secondary">
        <img
          src={book.cover}
          alt={book.title}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={book.type === "digital" ? "primary" : "muted"}>
            {book.type === "digital" ? "Digital" : "Physical"}
          </StatusBadge>
          {owned && <StatusBadge tone="success">Purchased</StatusBadge>}
        </div>
        <h2 className="mt-2 text-base font-semibold">{book.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{book.description}</p>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <p className="font-semibold">{EGP(book.price)}</p>
          {owned ? (
            book.type === "digital" && book.fileUrl ? (
              <Button asChild size="sm" variant="secondary">
                <a href={book.fileUrl} target="_blank" rel="noreferrer">
                  <Download className="size-4" /> Download
                </a>
              </Button>
            ) : (
              <StatusBadge tone="warning">
                <Truck className="size-3.5" /> Delivery in progress
              </StatusBadge>
            )
          ) : (
            <Button size="sm" onClick={() => setConfirm(true)}>
              Buy
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {enough ? `Buy ${book.title}?` : "Insufficient wallet balance"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {enough
                ? book.type === "digital"
                  ? "The book becomes downloadable immediately after purchase."
                  : "Your physical book will be delivered to the address on your profile."
                : `You need ${EGP(book.price - balance)} more in your wallet.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!enough}
              onClick={() => {
                const result = purchaseBook(book.id);
                if (result.ok) toast.success("Book purchased successfully.");
                else toast.error(result.message);
              }}
            >
              Confirm purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
