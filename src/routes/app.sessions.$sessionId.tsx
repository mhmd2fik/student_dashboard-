import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Download,
  FileText,
  Lock,
  PlayCircle,
  ShieldAlert,
  Timer,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { SessionStatusBadge, StatusBadge } from "@/components/StatusBadge";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/demo-data";
import {
  EGP,
  formatDateTime,
  formatMinutes,
  getAccessInfo,
  getPartProgress,
  getPartState,
  getSessionProgress,
  getSessionStatus,
  partTypeLabel,
} from "@/lib/logic";
import { useStudentStore } from "@/lib/store";
import type { Part, Question, Session } from "@/lib/types";

export const Route = createFileRoute("/app/sessions/$sessionId")({
  head: () => ({
    meta: [
      { title: "Session details — Student Portal" },
      {
        name: "description",
        content:
          "Session price, included parts, access period and the ordered learning player for purchased sessions.",
      },
      { property: "og:title", content: "Session details — Mathematics Academy" },
      {
        property: "og:description",
        content: "Price, included parts, access period and your learning progress.",
      },
    ],
  }),
  component: SessionPage,
});

function SessionPage() {
  const { sessionId } = Route.useParams();
  const store = useStudentStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  const [activePartId, setActivePartId] = useState<string | null>(null);

  if (!session) {
    return (
      <EmptyState
        icon={Lock}
        title="This session is not available for your level."
        actionLabel="Explore Classes"
        actionTo="/app/classes"
      />
    );
  }

  const purchase = store.purchaseOf(session.id);
  const access = getAccessInfo(purchase);
  const category = CATEGORIES.find((c) => c.id === session.categoryId);
  const prerequisite = session.prerequisiteSessionId
    ? store.sessions.find((s) => s.id === session.prerequisiteSessionId)
    : undefined;
  const prerequisitePurchased = prerequisite
    ? store.isSessionPurchased(prerequisite.id)
    : true;
  const status = getSessionStatus({
    session,
    ...(purchase ? { purchase } : {}),
    prerequisitePurchased,
    progress: store.progress,
  });
  const progress = getSessionProgress(session, store.progress);
  const ordered = [...session.parts].sort((a, b) => a.order - b.order);
  const activePart = ordered.find((p) => p.id === activePartId) ?? null;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/classes/$categoryId" params={{ categoryId: session.categoryId }}>
          <ChevronLeft className="size-4" /> {category?.name}
        </Link>
      </Button>

      <header className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="grid sm:grid-cols-[minmax(0,1fr)_320px]">
          <div className="order-2 p-5 sm:order-1 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <SessionStatusBadge status={status} />
              <StatusBadge tone="muted">{category?.name}</StatusBadge>
            </div>
            <h1 className="mt-3 text-2xl font-semibold">{session.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{session.description}</p>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Meta icon={Clock} label="Learning time">
                {formatMinutes(session.learningMinutes)}
              </Meta>
              <Meta icon={Timer} label="Access period">
                {session.accessDays} days from purchase
              </Meta>
              <Meta icon={FileText} label="Included parts">
                {ordered.map((p) => partTypeLabel[p.type]).join(" · ")}
              </Meta>
              {access.purchased && (
                <Meta icon={ShieldAlert} label="Access status">
                  {access.label}
                </Meta>
              )}
            </dl>

            {prerequisite && !prerequisitePurchased && (
              <Alert className="mt-4">
                <Lock className="size-4" />
                <AlertTitle>Locked</AlertTitle>
                <AlertDescription>
                  Purchase {prerequisite.name} to unlock this session. Completing it is
                  not required — purchasing is enough.
                </AlertDescription>
              </Alert>
            )}

            {access.purchased && !access.expired && (
              <div className="mt-5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {progress.done} of {progress.total} required parts completed
                  </span>
                  <span className="font-semibold">{progress.percent}%</span>
                </div>
                <Progress value={progress.percent} className="h-2" />
              </div>
            )}
          </div>

          <div className="order-1 aspect-[16/9] bg-primary-deep sm:order-2 sm:aspect-auto">
            <img
              src={session.cover}
              alt={session.name}
              width={1024}
              height={640}
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-border bg-secondary/40 p-5">
          <div className="min-w-0">
            {access.purchased ? (
              <p className="text-sm font-semibold text-success">Purchased</p>
            ) : (
              <p className="text-lg font-semibold">Price: {EGP(session.price)}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {access.purchased
                ? access.expired
                  ? "Your access period has ended. Contact the admin for renewal."
                  : `Access ${access.label.toLowerCase()}`
                : `Wallet balance: ${EGP(store.balance)}`}
            </p>
          </div>
          {access.purchased ? (
            <Button
              disabled={access.expired}
              onClick={() => {
                const next =
                  ordered.find(
                    (p) => getPartState(session, store.progress, p).status !== "completed",
                  ) ?? ordered[0];
                if (next) setActivePartId(next.id);
              }}
            >
              <PlayCircle className="size-4" /> Continue
            </Button>
          ) : (
            <PurchaseButton
              session={session}
              disabled={!prerequisitePurchased}
            />
          )}
        </div>
      </header>

      {access.purchased && access.expired && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Access expired</AlertTitle>
          <AlertDescription>
            Your {session.accessDays}-day access period for this session has ended, so the
            protected content is locked.
          </AlertDescription>
        </Alert>
      )}

      <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-base font-semibold">Session parts</h2>
          <ol className="space-y-2">
            {ordered.map((part, index) => {
              const state = getPartState(session, store.progress, part);
              const locked = state.status === "locked" || !access.purchased || access.expired;
              return (
                <li key={part.id}>
                  <button
                    disabled={locked}
                    onClick={() => setActivePartId(part.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      activePartId === part.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-secondary/60"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {part.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {partTypeLabel[part.type]}
                          {part.required ? "" : " · Optional"}
                        </span>
                      </span>
                      <PartStateBadge
                        status={
                          !access.purchased || access.expired ? "locked" : state.status
                        }
                      />
                    </div>
                    {state.status === "locked" && access.purchased && !access.expired && (
                      <p className="mt-2 text-xs text-muted-foreground">{state.reason}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="min-w-0">
          {!access.purchased || access.expired ? (
            <EmptyState
              icon={Lock}
              title="Protected content is locked"
              description={
                access.expired
                  ? "Your access period has ended."
                  : "Purchase this session to open its videos, PDFs, tests and homework."
              }
            />
          ) : activePart ? (
            <PartViewer session={session} part={activePart} />
          ) : (
            <EmptyState
              icon={PlayCircle}
              title="Select a part to start"
              description="Required parts open in order. Complete each one to unlock the next."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium">{children}</dd>
    </div>
  );
}

function PartStateBadge({ status }: { status: string }) {
  if (status === "completed")
    return <StatusBadge tone="success">Completed</StatusBadge>;
  if (status === "in_progress")
    return <StatusBadge tone="warning">In Progress</StatusBadge>;
  if (status === "locked") return <StatusBadge tone="muted">Locked</StatusBadge>;
  return <StatusBadge tone="primary">Available</StatusBadge>;
}

function PurchaseButton({
  session,
  disabled,
}: {
  session: Session;
  disabled: boolean;
}) {
  const { balance, purchaseSession } = useStudentStore();
  const [open, setOpen] = useState(false);
  const enough = balance >= session.price;
  const missing = session.price - balance;

  if (disabled)
    return (
      <Button disabled variant="secondary">
        <Lock className="size-4" /> Locked
      </Button>
    );

  return (
    <>
      <Button onClick={() => setOpen(true)}>Buy — {EGP(session.price)}</Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {enough ? "Purchase Session?" : "Insufficient wallet balance"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {enough
                ? "This purchase is paid from your wallet and starts your access period today."
                : "You cannot purchase this session until you recharge your wallet."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <dl className="space-y-2 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
            <Row label="Session">{session.name}</Row>
            <Row label="Price">{EGP(session.price)}</Row>
            <Row label="Current balance">{EGP(balance)}</Row>
            {enough ? (
              <Row label="Remaining after purchase">
                {EGP(balance - session.price)}
              </Row>
            ) : (
              <Row label="Required additional amount">
                <span className="text-destructive">{EGP(missing)}</span>
              </Row>
            )}
            <Row label="Access period">{session.accessDays} days from today</Row>
          </dl>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {enough ? (
              <AlertDialogAction
                onClick={() => {
                  const result = purchaseSession(session.id);
                  if (result.ok) toast.success("Session purchased. Access starts now.");
                  else toast.error(result.message);
                }}
              >
                Confirm Purchase
              </AlertDialogAction>
            ) : (
              <AlertDialogAction asChild>
                <Link to="/app/wallet">Recharge Wallet</Link>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

function PartViewer({ session, part }: { session: Session; part: Part }) {
  if (part.type === "video") return <VideoPartView part={part} />;
  if (part.type === "pdf") return <PdfPartView part={part} />;
  if (part.type === "test") return <TestPartView session={session} part={part} />;
  return <HomeworkPartView part={part} />;
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function VideoPartView({ part }: { part: Part }) {
  const { progress, openVideo, updateWatch, completePart } = useStudentStore();
  const info = getPartProgress(progress, part.id);
  const video = part.video!;
  const opened = useRef(false);

  useEffect(() => {
    if (!opened.current && info.opens < video.maxOpens && info.status !== "completed") {
      opened.current = true;
      openVideo(part);
    }
  }, [info.opens, info.status, openVideo, part, video.maxOpens]);

  const blocked = info.opens >= video.maxOpens && info.status !== "completed" && info.watchedPercent === 0;
  const usedOpens = Math.min(info.opens, video.maxOpens);

  return (
    <Panel title={part.title} subtitle={`Video · ${formatMinutes(video.durationMinutes)}`}>
      {blocked ? (
        <Alert variant="destructive">
          <ShieldAlert className="size-4" />
          <AlertTitle>Video locked</AlertTitle>
          <AlertDescription>
            You have reached the maximum number of video openings allowed for this
            session. Please contact the admin if you need another attempt.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-primary-deep">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
              title={part.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        </div>
      )}

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Meta icon={PlayCircle} label="Views used">
          {usedOpens} / {video.maxOpens}
        </Meta>
        <Meta icon={Clock} label="Watch duration">
          {formatMinutes(info.watchedMinutes)}
        </Meta>
        <Meta icon={CheckCircle2} label="Progress">
          {info.watchedPercent}%
        </Meta>
      </dl>
      <Progress value={info.watchedPercent} className="mt-3 h-2" />

      {!blocked && info.status !== "completed" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              updateWatch(
                part.id,
                Math.min(99, info.watchedPercent + 25),
                Math.round(video.durationMinutes * Math.min(0.99, (info.watchedPercent + 25) / 100)),
              )
            }
          >
            Save watch progress
          </Button>
          <Button
            onClick={() => {
              completePart(part.id);
              toast.success("Video marked as completed.");
            }}
          >
            <CheckCircle2 className="size-4" /> Mark as completed
          </Button>
        </div>
      )}
      {info.status === "completed" && (
        <p className="mt-4 text-sm font-medium text-success">This part is completed.</p>
      )}
    </Panel>
  );
}

function PdfPartView({ part }: { part: Part }) {
  const { progress, completePart } = useStudentStore();
  const info = getPartProgress(progress, part.id);
  const pdf = part.pdf!;

  return (
    <Panel title={part.title} subtitle={`PDF · ${pdf.pages} pages`}>
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe src={pdf.url} title={pdf.fileName} className="h-[520px] w-full" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button asChild variant="secondary">
          <a href={pdf.url} target="_blank" rel="noreferrer" download={pdf.fileName}>
            <Download className="size-4" /> Download PDF
          </a>
        </Button>
        {info.status === "completed" ? (
          <StatusBadge tone="success">Completed</StatusBadge>
        ) : (
          <Button
            onClick={() => {
              completePart(part.id);
              toast.success("PDF marked as completed.");
            }}
          >
            <CheckCircle2 className="size-4" /> Mark as completed
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        This PDF stays available while your session access is valid.
      </p>
    </Panel>
  );
}

function TestPartView({ session, part }: { session: Session; part: Part }) {
  const { attempts, submitTest } = useStudentStore();
  const test = part.test!;
  const attempt = attempts.find((a) => a.partId === part.id);
  const [started, setStarted] = useState(false);
  const [confirmStart, setConfirmStart] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(test.durationMinutes * 60);

  const doSubmit = () => {
    submitTest(part, answers);
    setStarted(false);
    toast.success("Test submitted.");
  };

  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          doSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  if (attempt) {
    const percent = attempt.manualGraded
      ? Math.round(((attempt.finalScore ?? 0) / test.totalDegree) * 100)
      : null;
    const failed = attempt.manualGraded && !attempt.passed;
    return (
      <Panel title={part.title} subtitle="Test result · one attempt only">
        {attempt.manualGraded ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Score">
                {attempt.finalScore} / {test.totalDegree}
              </Stat>
              <Stat label="Percentage">{percent}%</Stat>
              <Stat label="Result">
                {attempt.passed ? (
                  <span className="text-success">Passed</span>
                ) : (
                  <span className="text-destructive">Failed</span>
                )}
              </Stat>
            </div>
            {failed && (
              <Alert className="mt-4">
                <AlertTriangle className="size-4" />
                <AlertTitle>Study warning</AlertTitle>
                <AlertDescription>
                  You should return and study the previous session before continuing. You
                  can still move on to the next part.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <Alert>
            <Clock className="size-4" />
            <AlertTitle>Waiting for teacher grading</AlertTitle>
            <AlertDescription>
              Auto-graded questions: {attempt.autoScore} / {attempt.autoTotal}. The
              remaining {attempt.manualTotal} degrees are graded manually by your teacher.
            </AlertDescription>
          </Alert>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Submitted {formatDateTime(attempt.submittedAt)} · Attempts used 1 / 1. Contact
          the admin if you need your attempt reset.
        </p>
      </Panel>
    );
  }

  if (!started) {
    return (
      <Panel title={part.title} subtitle={`Test information · ${session.name}`}>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Stat label="Questions">{test.questions.length}</Stat>
          <Stat label="Total degree">{test.totalDegree}</Stat>
          <Stat label="Passing degree">{test.passingDegree}</Stat>
          <Stat label="Time limit">{formatMinutes(test.durationMinutes)}</Stat>
          <Stat label="Attempts">1</Stat>
        </dl>
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="size-4" />
          <AlertTitle>You can attempt this test only once.</AlertTitle>
          <AlertDescription>
            The timer starts immediately and the test submits automatically when it
            reaches zero.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => setConfirmStart(true)}>
          Start test
        </Button>

        <AlertDialog open={confirmStart} onOpenChange={setConfirmStart}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start your only attempt?</AlertDialogTitle>
              <AlertDialogDescription>
                Once started, the {test.durationMinutes}-minute timer cannot be paused and
                you cannot retake this test.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setStarted(true)}>
                Start now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Panel>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Panel title={part.title} subtitle="Answer every question, then submit">
      <div className="sticky top-16 z-10 mb-4 flex items-center justify-between rounded-lg border border-border bg-card/95 px-4 py-2 backdrop-blur">
        <span className="text-sm text-muted-foreground">Time remaining</span>
        <span className="font-display text-lg font-semibold tabular-nums">
          {mm}:{ss}
        </span>
      </div>

      <div className="space-y-5">
        {test.questions.map((q, i) => (
          <QuestionField
            key={q.id}
            index={i + 1}
            question={q}
            value={answers[q.id] ?? ""}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
          />
        ))}
      </div>

      <Button className="mt-5 w-full sm:w-auto" onClick={() => setConfirmSubmit(true)}>
        Submit test
      </Button>

      <AlertDialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit your test?</AlertDialogTitle>
            <AlertDialogDescription>
              This is your only attempt. After submitting you cannot change your answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep answering</AlertDialogCancel>
            <AlertDialogAction onClick={doSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Panel>
  );
}

function QuestionField({
  index,
  question,
  value,
  onChange,
}: {
  index: number;
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
        <p className="text-sm font-medium">
          {index}. {question.text}
        </p>
        <StatusBadge tone="muted">{question.degree} deg</StatusBadge>
      </div>

      {question.type === "mcq" && question.choices && (
        <RadioGroup value={value} onValueChange={onChange} className="mt-3 space-y-2">
          {question.choices.map((c) => (
            <Label
              key={c.id}
              htmlFor={c.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm font-normal transition-colors hover:bg-secondary/60"
            >
              <RadioGroupItem id={c.id} value={c.id} />
              {c.text}
            </Label>
          ))}
        </RadioGroup>
      )}

      {question.type === "written" && (
        <Textarea
          className="mt-3"
          rows={4}
          placeholder="Write your answer…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === "photo" && (
        <div className="mt-3 space-y-2">
          <Label htmlFor={`file-${question.id}`} className="text-xs text-muted-foreground">
            Upload a photo of your handwritten solution
          </Label>
          <Input
            id={`file-${question.id}`}
            type="file"
            accept="image/*"
            onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
          />
          {value && (
            <p className="text-xs text-success">Attached: {value}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Graded manually by your teacher.
          </p>
        </div>
      )}
    </div>
  );
}

function HomeworkPartView({ part }: { part: Part }) {
  const { homework, submitHomework } = useStudentStore();
  const hw = part.homework!;
  const submission = homework.find((h) => h.partId === part.id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState("");
  const [confirm, setConfirm] = useState(false);

  if (submission) {
    return (
      <Panel title={part.title} subtitle="Homework submission">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Status">Submitted</Stat>
          <Stat label="Submitted on">{formatDateTime(submission.submittedAt)}</Stat>
          <Stat label="Grade">
            {submission.grade != null
              ? `${submission.grade} / ${submission.totalDegree}`
              : "—"}
          </Stat>
        </div>
        {submission.grade == null && (
          <Alert className="mt-4">
            <Clock className="size-4" />
            <AlertTitle>Waiting for teacher grading</AlertTitle>
            <AlertDescription>
              Your homework has been received. The grade appears here once your teacher
              finishes grading.
            </AlertDescription>
          </Alert>
        )}
        {submission.feedback && (
          <p className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
            {submission.feedback}
          </p>
        )}
      </Panel>
    );
  }

  const canSubmit = hw.mode === "pdf" ? Boolean(fileName) : true;

  return (
    <Panel title={part.title} subtitle={`Homework · ${hw.totalDegree} degrees`}>
      <p className="text-sm text-muted-foreground">{hw.instructions}</p>

      {hw.mode === "test" && hw.questions ? (
        <div className="mt-4 space-y-5">
          {hw.questions.map((q, i) => (
            <QuestionField
              key={q.id}
              index={i + 1}
              question={q}
              value={answers[q.id] ?? ""}
              onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2 rounded-xl border border-dashed border-border p-4">
          <Label htmlFor="hw-pdf" className="flex items-center gap-2 text-sm">
            <Upload className="size-4" /> Upload your homework PDF
          </Label>
          <Input
            id="hw-pdf"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          {fileName && <p className="text-xs text-success">Selected: {fileName}</p>}
        </div>
      )}

      <Button className="mt-5" disabled={!canSubmit} onClick={() => setConfirm(true)}>
        Submit homework
      </Button>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit your homework?</AlertDialogTitle>
            <AlertDialogDescription>
              This is a final submission. You cannot submit again unless the admin allows
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                submitHomework(
                  part,
                  hw.mode === "pdf" ? { fileName } : { answers },
                );
                toast.success("Homework submitted for grading.");
              }}
            >
              Confirm submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Panel>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{children}</p>
    </div>
  );
}
