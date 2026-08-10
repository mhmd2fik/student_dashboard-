import type {
  Part,
  PartProgress,
  Session,
  Purchase,
  TestAttempt,
} from "./types";

export const EGP = (n: number) =>
  `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} EGP`;

export function daysBetween(from: Date, to: Date) {
  return Math.ceil((to.getTime() - from.getTime()) / 86400000);
}

export interface AccessInfo {
  purchased: boolean;
  expired: boolean;
  expiresAt?: Date;
  daysRemaining: number;
  label: string;
}

export function getAccessInfo(purchase?: Purchase): AccessInfo {
  if (!purchase) {
    return { purchased: false, expired: false, daysRemaining: 0, label: "Not purchased" };
  }
  const expiresAt = new Date(purchase.expiresAt);
  const remaining = daysBetween(new Date(), expiresAt);
  if (remaining <= 0) {
    return { purchased: true, expired: true, expiresAt, daysRemaining: 0, label: "Expired" };
  }
  return {
    purchased: true,
    expired: false,
    expiresAt,
    daysRemaining: remaining,
    label:
      remaining === 1
        ? "Expires tomorrow"
        : `${remaining} days remaining`,
  };
}

export const emptyProgress: PartProgress = {
  status: "not_started",
  opens: 0,
  watchedPercent: 0,
  watchedMinutes: 0,
};

export function getPartProgress(
  progress: Record<string, PartProgress>,
  partId: string,
): PartProgress {
  return progress[partId] ?? emptyProgress;
}

export type PartLockState =
  | { status: "locked"; reason: string }
  | { status: "available" }
  | { status: "in_progress" }
  | { status: "completed" };

export function getPartState(
  session: Session,
  progress: Record<string, PartProgress>,
  part: Part,
): PartLockState {
  const ordered = [...session.parts].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((p) => p.id === part.id);
  const blocker = ordered
    .slice(0, index)
    .find((p) => p.required && getPartProgress(progress, p.id).status !== "completed");

  const own = getPartProgress(progress, part.id);
  if (own.status === "completed") return { status: "completed" };
  if (blocker) {
    return {
      status: "locked",
      reason: `Complete "${blocker.title}" to unlock this part.`,
    };
  }
  if (own.status === "in_progress") return { status: "in_progress" };
  return { status: "available" };
}

export function getSessionProgress(
  session: Session,
  progress: Record<string, PartProgress>,
) {
  const required = session.parts.filter((p) => p.required);
  const done = required.filter(
    (p) => getPartProgress(progress, p.id).status === "completed",
  ).length;
  const percent = required.length ? Math.round((done / required.length) * 100) : 0;
  return { done, total: required.length, percent, completed: percent === 100 };
}

export type SessionStatus =
  | "available"
  | "locked"
  | "purchased"
  | "in_progress"
  | "completed"
  | "expired";

export function getSessionStatus(opts: {
  session: Session;
  purchase?: Purchase;
  prerequisitePurchased: boolean;
  progress: Record<string, PartProgress>;
}): SessionStatus {
  const { session, purchase, prerequisitePurchased, progress } = opts;
  const access = getAccessInfo(purchase);
  if (access.purchased && access.expired) return "expired";
  if (access.purchased) {
    const p = getSessionProgress(session, progress);
    if (p.completed) return "completed";
    if (p.done > 0) return "in_progress";
    return "purchased";
  }
  if (session.prerequisiteSessionId && !prerequisitePurchased) return "locked";
  return "available";
}

export function gradeAttempt(
  test: { questions: import("./types").Question[] },
  answers: Record<string, string>,
): Omit<TestAttempt, "partId" | "submittedAt" | "answers"> {
  let autoScore = 0;
  let autoTotal = 0;
  let manualTotal = 0;
  for (const q of test.questions) {
    if (q.type === "mcq") {
      autoTotal += q.degree;
      if (answers[q.id] && answers[q.id] === q.correctChoiceId) autoScore += q.degree;
    } else {
      manualTotal += q.degree;
    }
  }
  const manualGraded = manualTotal === 0;
  return {
    autoScore,
    autoTotal,
    manualTotal,
    manualGraded,
    finalScore: manualGraded ? autoScore : undefined,
  };
}

export const partTypeLabel: Record<Part["type"], string> = {
  video: "Video",
  pdf: "PDF",
  test: "Test",
  homework: "Homework",
};

export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m ? `${m}m` : ""}`.trim() : `${m}m`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
