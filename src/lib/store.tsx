import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  BOOKS,
  CATEGORIES,
  DEMO_STUDENT,
  INITIAL_TRANSACTIONS,
  NOTIFICATIONS,
  SESSIONS,
} from "./demo-data";
import { gradeAttempt, getAccessInfo, getSessionProgress } from "./logic";
import type {
  Book,
  BookOrder,
  BookPurchase,
  HomeworkSubmission,
  Level,
  Notification,
  Part,
  PartProgress,
  Purchase,
  Session,
  Student,
  TestAttempt,
  Transaction,
} from "./types";

const STORAGE_KEY = "mathplatform.student.v1";
const DEVICE_KEY = "mathplatform.device.v1";

const iso = (daysOffset: number) =>
  new Date(Date.now() + daysOffset * 86400000).toISOString();

const makePurchase = (sessionId: string, purchasedDaysAgo: number): Purchase => {
  const session = SESSIONS.find((s) => s.id === sessionId)!;
  return {
    id: `pur_${sessionId}`,
    sessionId,
    purchasedAt: iso(-purchasedDaysAgo),
    expiresAt: iso(-purchasedDaysAgo + session.accessDays),
  };
};

interface AppState {
  accounts: Student[];
  currentStudentId: string | null;
  balance: number;
  purchases: Purchase[];
  bookPurchases: BookPurchase[];
  orders: BookOrder[];
  transactions: Transaction[];
  progress: Record<string, PartProgress>;
  attempts: TestAttempt[];
  homework: HomeworkSubmission[];
  notifications: Notification[];
}

const initialState = (): AppState => ({
  accounts: [DEMO_STUDENT],
  currentStudentId: null,
  balance: 400,
  purchases: [
    makePurchase("ses_mech_01", 12),
    makePurchase("ses_mech_02", 5),
    makePurchase("ses_mech_03", 3),
    makePurchase("ses_alg_01", 12),
  ],
  bookPurchases: [
    { id: "bp_1", bookId: "bk_2", purchasedAt: iso(-10) },
    { id: "bp_2", bookId: "bk_3", purchasedAt: iso(-4) },
  ],
  orders: [
    {
      id: "ORD-10241",
      bookId: "bk_1",
      quantity: 1,
      total: 150,
      address: "14 El-Nasr Street, Nasr City, Cairo",
      phone: DEMO_STUDENT.phone,
      createdAt: iso(-9),
      status: "Delivered",
    },
  ],
  transactions: INITIAL_TRANSACTIONS,
  progress: {
    p_m1_1: { status: "completed", opens: 1, watchedPercent: 100, watchedMinutes: 32 },
    p_m1_2: { status: "completed", opens: 1, watchedPercent: 100, watchedMinutes: 0 },
    p_m1_3: { status: "completed", opens: 1, watchedPercent: 100, watchedMinutes: 0 },
    p_m2_1: { status: "completed", opens: 1, watchedPercent: 100, watchedMinutes: 28 },
    p_m2_2: { status: "in_progress", opens: 1, watchedPercent: 42, watchedMinutes: 14 },
    p_m3_1: { status: "completed", opens: 1, watchedPercent: 100, watchedMinutes: 30 },
    p_m3_2: { status: "completed", opens: 1, watchedPercent: 100, watchedMinutes: 0 },
    p_a1_1: { status: "completed", opens: 2, watchedPercent: 100, watchedMinutes: 26 },
  },
  attempts: [
    {
      partId: "p_m1_3",
      submittedAt: iso(-10),
      autoScore: 10,
      autoTotal: 10,
      manualTotal: 10,
      manualGraded: true,
      finalScore: 16,
      passed: true,
      answers: {},
    },
  ],
  homework: [],
  notifications: NOTIFICATIONS,
});

function loadState(): AppState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    return { ...initialState(), ...(JSON.parse(raw) as AppState) };
  } catch {
    return initialState();
  }
}

function getDeviceId() {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `dev_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export type LoginResult =
  | { ok: true }
  | { ok: false; code: "invalid" | "pending" | "device"; message: string };

export type PurchaseResult =
  | { ok: true }
  | { ok: false; message: string };

interface StoreValue {
  hydrated: boolean;
  student: Student | null;
  balance: number;
  level: Level | null;
  categories: ReturnType<typeof visibleCategories>;
  sessions: Session[];
  books: Book[];
  purchases: Purchase[];
  bookPurchases: BookPurchase[];
  orders: BookOrder[];
  transactions: Transaction[];
  progress: Record<string, PartProgress>;
  attempts: TestAttempt[];
  homework: HomeworkSubmission[];
  notifications: Notification[];
  unreadCount: number;
  purchaseOf: (sessionId: string) => Purchase | undefined;
  isSessionPurchased: (sessionId: string) => boolean;
  ownsBook: (bookId: string) => boolean;
  login: (identifier: string, password: string) => LoginResult;
  register: (data: Omit<Student, "id" | "studentId" | "status" | "deviceId">) => string;
  logout: () => void;
  recharge: (amount: number) => void;
  purchaseSession: (sessionId: string) => PurchaseResult;
  purchaseBook: (bookId: string) => PurchaseResult;
  orderBook: (
    bookId: string,
    quantity: number,
    address: string,
    phone: string,
  ) => PurchaseResult;
  openVideo: (part: Part) => void;
  updateWatch: (partId: string, percent: number, minutes: number) => void;
  completePart: (partId: string) => void;
  submitTest: (part: Part, answers: Record<string, string>) => void;
  submitHomework: (
    part: Part,
    payload: { answers?: Record<string, string>; fileName?: string },
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

function visibleCategories(level: Level | null) {
  return CATEGORIES.filter((c) => c.level === level);
}

const StoreContext = createContext<StoreValue | null>(null);

export function StudentStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => initialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const student = useMemo(
    () => state.accounts.find((a) => a.id === state.currentStudentId) ?? null,
    [state.accounts, state.currentStudentId],
  );

  const level = student?.level ?? null;

  const sessions = useMemo(
    () => SESSIONS.filter((s) => s.published && s.level === level),
    [level],
  );
  const books = useMemo(
    () => BOOKS.filter((b) => b.available && b.level === level),
    [level],
  );
  const categories = useMemo(() => visibleCategories(level), [level]);

  const purchaseOf = useCallback(
    (sessionId: string) => state.purchases.find((p) => p.sessionId === sessionId),
    [state.purchases],
  );

  const addTransaction = useCallback(
    (
      prev: AppState,
      type: Transaction["type"],
      description: string,
      amount: number,
    ): AppState => {
      const balance = prev.balance + amount;
      const tx: Transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        date: new Date().toISOString(),
        type,
        description,
        amount,
        balanceAfter: balance,
      };
      return { ...prev, balance, transactions: [tx, ...prev.transactions] };
    },
    [],
  );

  const login = useCallback<StoreValue["login"]>((identifier, password) => {
    const id = identifier.trim().toLowerCase();
    const account = state.accounts.find(
      (a) =>
        a.phone.toLowerCase() === id || a.studentId.toLowerCase() === id,
    );
    if (!account || account.password !== password) {
      return {
        ok: false,
        code: "invalid",
        message: "Incorrect phone / student ID or password.",
      };
    }
    if (account.status === "pending") {
      return {
        ok: false,
        code: "pending",
        message:
          "Your account is waiting for admin approval. You will be able to log in once your account has been approved.",
      };
    }
    const device = getDeviceId();
    if (account.deviceId && account.deviceId !== device) {
      return {
        ok: false,
        code: "device",
        message:
          "This account is already registered on another device. Please contact the admin to change your authorized device.",
      };
    }
    setState((prev) => ({
      ...prev,
      currentStudentId: account.id,
      accounts: prev.accounts.map((a) =>
        a.id === account.id ? { ...a, deviceId: a.deviceId ?? device } : a,
      ),
    }));
    return { ok: true };
  }, [state.accounts]);

  const register = useCallback<StoreValue["register"]>((data) => {
    const seq = String(Date.now()).slice(-4);
    const studentId = `STU-2026-${seq}`;
    setState((prev) => ({
      ...prev,
      accounts: [
        ...prev.accounts,
        {
          ...data,
          id: `stu_${seq}`,
          studentId,
          status: "pending",
          deviceId: null,
        },
      ],
    }));
    return studentId;
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentStudentId: null }));
  }, []);

  const recharge = useCallback(
    (amount: number) => {
      setState((prev) =>
        addTransaction(prev, "Fawry Recharge", "Wallet recharge via Fawry", amount),
      );
    },
    [addTransaction],
  );

  const purchaseSession = useCallback<StoreValue["purchaseSession"]>(
    (sessionId) => {
      const session = SESSIONS.find((s) => s.id === sessionId);
      if (!session || !session.published || session.level !== level) {
        return { ok: false, message: "This session is not available for your level." };
      }
      if (state.purchases.some((p) => p.sessionId === sessionId)) {
        return { ok: false, message: "You already own this session." };
      }
      if (
        session.prerequisiteSessionId &&
        !state.purchases.some((p) => p.sessionId === session.prerequisiteSessionId)
      ) {
        return { ok: false, message: "You must purchase the prerequisite session first." };
      }
      if (state.balance < session.price) {
        return { ok: false, message: "Insufficient wallet balance." };
      }
      setState((prev) => {
        if (prev.purchases.some((p) => p.sessionId === sessionId)) return prev;
        const next = addTransaction(
          prev,
          "Session Purchase",
          session.name,
          -session.price,
        );
        return {
          ...next,
          purchases: [
            ...next.purchases,
            {
              id: `pur_${Date.now()}`,
              sessionId,
              purchasedAt: new Date().toISOString(),
              expiresAt: iso(session.accessDays),
            },
          ],
        };
      });
      return { ok: true };
    },
    [addTransaction, level, state.balance, state.purchases],
  );

  const purchaseBook = useCallback<StoreValue["purchaseBook"]>(
    (bookId) => {
      const book = BOOKS.find((b) => b.id === bookId);
      if (!book || !book.available || book.level !== level) {
        return { ok: false, message: "This book is not available for your level." };
      }
      if (state.bookPurchases.some((b) => b.bookId === bookId)) {
        return { ok: false, message: "This book is already in your library." };
      }
      if (state.balance < book.price) {
        return { ok: false, message: "Insufficient wallet balance." };
      }
      setState((prev) => {
        if (prev.bookPurchases.some((b) => b.bookId === bookId)) return prev;
        const next = addTransaction(
          prev,
          "Book Purchase",
          `${book.name} (PDF)`,
          -book.price,
        );
        return {
          ...next,
          bookPurchases: [
            ...next.bookPurchases,
            { id: `bp_${Date.now()}`, bookId, purchasedAt: new Date().toISOString() },
          ],
        };
      });
      return { ok: true };
    },
    [addTransaction, level, state.balance, state.bookPurchases],
  );

  const orderBook = useCallback<StoreValue["orderBook"]>(
    (bookId, quantity, address, phone) => {
      const book = BOOKS.find((b) => b.id === bookId);
      if (!book || !book.available || book.level !== level) {
        return { ok: false, message: "This book is not available for your level." };
      }
      const total = book.price * quantity;
      if (quantity < 1) return { ok: false, message: "Select a valid quantity." };
      if (state.balance < total) {
        return { ok: false, message: "Insufficient wallet balance." };
      }
      if (!address.trim()) {
        return { ok: false, message: "A delivery address is required." };
      }
      setState((prev) => {
        const next = addTransaction(
          prev,
          "Book Purchase",
          `${book.name} × ${quantity}`,
          -total,
        );
        return {
          ...next,
          orders: [
            {
              id: `ORD-${String(Date.now()).slice(-5)}`,
              bookId,
              quantity,
              total,
              address,
              phone,
              createdAt: new Date().toISOString(),
              status: "Processing",
            },
            ...next.orders,
          ],
        };
      });
      return { ok: true };
    },
    [addTransaction, level, state.balance],
  );

  const setPart = useCallback(
    (partId: string, patch: Partial<PartProgress>) => {
      setState((prev) => {
        const current: PartProgress =
          prev.progress[partId] ??
          { status: "not_started", opens: 0, watchedPercent: 0, watchedMinutes: 0 };
        return {
          ...prev,
          progress: { ...prev.progress, [partId]: { ...current, ...patch } },
        };
      });
    },
    [],
  );

  const openVideo = useCallback(
    (part: Part) => {
      setState((prev) => {
        const current: PartProgress =
          prev.progress[part.id] ??
          { status: "not_started", opens: 0, watchedPercent: 0, watchedMinutes: 0 };
        const max = part.video?.maxOpens ?? 1;
        if (current.opens >= max) return prev;
        return {
          ...prev,
          progress: {
            ...prev.progress,
            [part.id]: {
              ...current,
              opens: current.opens + 1,
              status: current.status === "completed" ? "completed" : "in_progress",
            },
          },
        };
      });
    },
    [],
  );

  const updateWatch = useCallback(
    (partId: string, percent: number, minutes: number) => {
      setPart(partId, {
        watchedPercent: percent,
        watchedMinutes: minutes,
        status: percent >= 100 ? "completed" : "in_progress",
      });
    },
    [setPart],
  );

  const completePart = useCallback(
    (partId: string) => setPart(partId, { status: "completed", watchedPercent: 100 }),
    [setPart],
  );

  const submitTest = useCallback<StoreValue["submitTest"]>((part, answers) => {
    if (!part.test) return;
    const graded = gradeAttempt(part.test, answers);
    const passed = graded.manualGraded
      ? (graded.finalScore ?? 0) >= part.test.passingDegree
      : undefined;
    setState((prev) => {
      if (prev.attempts.some((a) => a.partId === part.id)) return prev;
      return {
        ...prev,
        attempts: [
          ...prev.attempts,
          {
            partId: part.id,
            submittedAt: new Date().toISOString(),
            answers,
            ...graded,
            passed,
          },
        ],
        progress: {
          ...prev.progress,
          [part.id]: {
            status: "completed",
            opens: 1,
            watchedPercent: 100,
            watchedMinutes: 0,
          },
        },
      };
    });
  }, []);

  const submitHomework = useCallback<StoreValue["submitHomework"]>(
    (part, payload) => {
      if (!part.homework) return;
      setState((prev) => {
        if (prev.homework.some((h) => h.partId === part.id)) return prev;
        return {
          ...prev,
          homework: [
            ...prev.homework,
            {
              partId: part.id,
              submittedAt: new Date().toISOString(),
              mode: part.homework!.mode,
              totalDegree: part.homework!.totalDegree,
              ...payload,
            },
          ],
          progress: {
            ...prev.progress,
            [part.id]: {
              status: "completed",
              opens: 1,
              watchedPercent: 100,
              watchedMinutes: 0,
            },
          },
        };
      });
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  }, []);

  const markAllRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const value: StoreValue = {
    hydrated,
    student,
    balance: state.balance,
    level,
    categories,
    sessions,
    books,
    purchases: state.purchases,
    bookPurchases: state.bookPurchases,
    orders: state.orders,
    transactions: state.transactions,
    progress: state.progress,
    attempts: state.attempts,
    homework: state.homework,
    notifications: state.notifications,
    unreadCount: state.notifications.filter((n) => !n.read).length,
    purchaseOf,
    isSessionPurchased: (sessionId) =>
      state.purchases.some((p) => p.sessionId === sessionId),
    ownsBook: (bookId) => state.bookPurchases.some((b) => b.bookId === bookId),
    login,
    register,
    logout,
    recharge,
    purchaseSession,
    purchaseBook,
    orderBook,
    openVideo,
    updateWatch,
    completePart,
    submitTest,
    submitHomework,
    markNotificationRead,
    markAllRead,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStudentStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStudentStore must be used inside StudentStoreProvider");
  return ctx;
}

export { getAccessInfo, getSessionProgress };
