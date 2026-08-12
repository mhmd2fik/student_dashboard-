export type Level =
  | "3rd Preparatory"
  | "1st Secondary"
  | "1st Secondary – Baccalaureate"
  | "2nd Secondary"
  | "2nd Secondary – Baccalaureate"
  | "3rd Secondary";

export const LEVELS: Level[] = [
  "3rd Preparatory",
  "1st Secondary",
  "1st Secondary – Baccalaureate",
  "2nd Secondary",
  "2nd Secondary – Baccalaureate",
  "3rd Secondary",
];

export type AccountStatus = "pending" | "approved";

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  phone: string;
  parentPhone: string;
  password: string;
  gender: "Male" | "Female";
  governorate: string;
  level: Level;
  avatar?: string | undefined;
  status: AccountStatus;
  deviceId: string | null;
}

export interface Category {
  id: string;
  name: string;
  level: Level;
  image: string;
  description: string;
}

export type PartType = "video" | "pdf" | "test" | "homework";

export interface QuestionChoice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: "mcq" | "written" | "photo";
  text: string;
  degree: number;
  choices?: QuestionChoice[] | undefined;
  correctChoiceId?: string | undefined;
}

export interface VideoPart {
  youtubeId: string;
  durationMinutes: number;
  maxOpens: number;
}

export interface PdfPart {
  fileName: string;
  url: string;
  pages: number;
}

export interface TestPart {
  totalDegree: number;
  passingDegree: number;
  durationMinutes: number;
  questions: Question[];
}

export interface HomeworkPart {
  mode: "test" | "pdf";
  instructions: string;
  totalDegree: number;
  questions?: Question[] | undefined;
}

export interface Part {
  id: string;
  order: number;
  type: PartType;
  title: string;
  required: boolean;
  video?: VideoPart | undefined;
  pdf?: PdfPart | undefined;
  test?: TestPart | undefined;
  homework?: HomeworkPart | undefined;
}

export interface Session {
  id: string;
  name: string;
  categoryId: string;
  level: Level;
  cover: string;
  price: number;
  description: string;
  learningMinutes: number;
  accessDays: number;
  published: boolean;
  publishedAt: string;
  prerequisiteSessionId?: string | undefined;
  parts: Part[];
}

export interface Book {
  id: string;
  name: string;
  level: Level;
  kind: "physical" | "digital";
  cover: string;
  description: string;
  price: number;
  available: boolean;
  pdfUrl?: string | undefined;
}

export interface Purchase {
  id: string;
  sessionId: string;
  purchasedAt: string;
  expiresAt: string;
}

export interface BookPurchase {
  id: string;
  bookId: string;
  purchasedAt: string;
}

export interface BookOrder {
  id: string;
  bookId: string;
  quantity: number;
  total: number;
  address: string;
  phone: string;
  createdAt: string;
  status: "Processing" | "Delivered";
}

export interface Transaction {
  id: string;
  date: string;
  type: "Code Recharge" | "Session Purchase" | "Book Purchase" | "Refund";
  description: string;
  amount: number;
  balanceAfter: number;
}

export type PartStatus = "not_started" | "in_progress" | "completed";

export interface PartProgress {
  status: PartStatus;
  opens: number;
  watchedPercent: number;
  watchedMinutes: number;
}

export interface TestAttempt {
  partId: string;
  submittedAt: string;
  autoScore: number;
  autoTotal: number;
  manualTotal: number;
  manualGraded: boolean;
  finalScore?: number | undefined;
  passed?: boolean | undefined;
  answers: Record<string, string>;
}

export interface HomeworkSubmission {
  partId: string;
  submittedAt: string;
  mode: "test" | "pdf";
  fileName?: string | undefined;
  answers?: Record<string, string> | undefined;
  grade?: number | undefined;
  totalDegree: number;
  feedback?: string | undefined;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  image?: string | undefined;
  date: string;
  read: boolean;
}

export interface RechargeCode {
  code: string;
  value: number;
}
