import type {
  Book,
  Category,
  Notification,
  Session,
  Student,
  Transaction,
} from "./types";

import coverMechanics from "@/assets/cover-mechanics.jpg";
import coverAlgebra from "@/assets/cover-algebra.jpg";
import coverCalculus from "@/assets/cover-calculus.jpg";
import bookPhysical from "@/assets/book-physical.jpg";
import bookDigital from "@/assets/book-digital.jpg";

export const SAMPLE_PDF =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const DEMO_STUDENT: Student = {
  id: "stu_1",
  studentId: "STU-2026-0148",
  fullName: "Ahmed Hassan",
  phone: "01012345678",
  parentPhone: "01198765432",
  password: "123456",
  gender: "Male",
  governorate: "Cairo",
  level: "3rd Secondary",
  status: "approved",
  deviceId: null,
};

export const CATEGORIES: Category[] = [
  {
    id: "cat_mech",
    name: "Mechanics",
    level: "3rd Secondary",
    image: coverMechanics,
    description: "Statics, dynamics and applied force analysis.",
  },
  {
    id: "cat_alg",
    name: "Algebra",
    level: "3rd Secondary",
    image: coverAlgebra,
    description: "Matrices, complex numbers and polynomial theory.",
  },
  {
    id: "cat_calc",
    name: "Calculus",
    level: "3rd Secondary",
    image: coverCalculus,
    description: "Differentiation, integration and applications.",
  },
  {
    id: "cat_alg_2s",
    name: "Algebra & Trigonometry",
    level: "2nd Secondary",
    image: coverAlgebra,
    description: "Not visible to 3rd Secondary students.",
  },
];

const mcq = (
  id: string,
  text: string,
  degree: number,
  choices: string[],
  correctIndex: number,
) => ({
  id,
  type: "mcq" as const,
  text,
  degree,
  choices: choices.map((c, i) => ({ id: `${id}_c${i}`, text: c })),
  correctChoiceId: `${id}_c${correctIndex}`,
});

export const SESSIONS: Session[] = [
  {
    id: "ses_mech_01",
    name: "Mechanics — Session 01",
    categoryId: "cat_mech",
    level: "3rd Secondary",
    cover: coverMechanics,
    price: 100,
    description:
      "Foundations of statics: forces, resultants and equilibrium of a particle with fully solved exam-style problems.",
    learningMinutes: 95,
    accessDays: 14,
    published: true,
    publishedAt: daysAgo(40),
    parts: [
      {
        id: "p_m1_1",
        order: 1,
        type: "video",
        title: "Forces and Resultants",
        required: true,
        video: { youtubeId: "fNk_zzaMoSs", durationMinutes: 32, maxOpens: 2 },
      },
      {
        id: "p_m1_2",
        order: 2,
        type: "pdf",
        title: "Session 01 Notes",
        required: true,
        pdf: { fileName: "mechanics-01-notes.pdf", url: SAMPLE_PDF, pages: 12 },
      },
      {
        id: "p_m1_3",
        order: 3,
        type: "test",
        title: "Session 01 Quiz",
        required: true,
        test: {
          totalDegree: 20,
          passingDegree: 12,
          durationMinutes: 15,
          questions: [
            mcq(
              "q_m1_1",
              "Two perpendicular forces of 3 N and 4 N act at a point. The magnitude of the resultant is:",
              5,
              ["5 N", "7 N", "1 N", "12 N"],
              0,
            ),
            mcq(
              "q_m1_2",
              "A particle is in equilibrium when the resultant of all forces acting on it equals:",
              5,
              ["Its weight", "Zero", "The largest force", "The friction force"],
              1,
            ),
            {
              id: "q_m1_3",
              type: "written",
              text: "State the conditions of equilibrium for three coplanar concurrent forces.",
              degree: 10,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ses_mech_02",
    name: "Mechanics — Session 02",
    categoryId: "cat_mech",
    level: "3rd Secondary",
    cover: coverMechanics,
    price: 120,
    description:
      "Moments, couples and the equilibrium of rigid bodies, including ladder and beam problems.",
    learningMinutes: 110,
    accessDays: 14,
    published: true,
    publishedAt: daysAgo(21),
    prerequisiteSessionId: "ses_mech_01",
    parts: [
      {
        id: "p_m2_1",
        order: 1,
        type: "video",
        title: "Moment of a Force",
        required: true,
        video: { youtubeId: "WUvTyaaNkzM", durationMinutes: 28, maxOpens: 2 },
      },
      {
        id: "p_m2_2",
        order: 2,
        type: "video",
        title: "Couples and Rigid Body Equilibrium",
        required: true,
        video: { youtubeId: "rHLEWRxRGiM", durationMinutes: 34, maxOpens: 2 },
      },
      {
        id: "p_m2_3",
        order: 3,
        type: "pdf",
        title: "Worked Examples Booklet",
        required: false,
        pdf: { fileName: "mechanics-02-examples.pdf", url: SAMPLE_PDF, pages: 18 },
      },
      {
        id: "p_m2_4",
        order: 4,
        type: "test",
        title: "Session 02 Test",
        required: true,
        test: {
          totalDegree: 30,
          passingDegree: 18,
          durationMinutes: 20,
          questions: [
            mcq(
              "q_m2_1",
              "The moment of a force about a point is measured in:",
              10,
              ["N", "N·m", "m/s²", "kg"],
              1,
            ),
            mcq(
              "q_m2_2",
              "A couple consists of two forces that are equal in magnitude and:",
              10,
              [
                "Parallel and in the same direction",
                "Parallel and opposite in direction",
                "Perpendicular",
                "Concurrent",
              ],
              1,
            ),
            {
              id: "q_m2_3",
              type: "photo",
              text: "Solve the ladder problem in the booklet (page 14) and upload a photo of your full solution.",
              degree: 10,
            },
          ],
        },
      },
      {
        id: "p_m2_5",
        order: 5,
        type: "homework",
        title: "Session 02 Homework",
        required: true,
        homework: {
          mode: "pdf",
          instructions:
            "Solve problems 1 to 10 from the booklet, scan your answers as a single PDF and upload it here.",
          totalDegree: 20,
        },
      },
    ],
  },
  {
    id: "ses_mech_03",
    name: "Mechanics — Session 03",
    categoryId: "cat_mech",
    level: "3rd Secondary",
    cover: coverMechanics,
    price: 100,
    description:
      "Friction on rough surfaces and motion on inclined planes, with a full exam drill.",
    learningMinutes: 100,
    accessDays: 7,
    published: true,
    publishedAt: daysAgo(6),
    prerequisiteSessionId: "ses_mech_02",
    parts: [
      {
        id: "p_m3_1",
        order: 1,
        type: "video",
        title: "Friction Fundamentals",
        required: true,
        video: { youtubeId: "fNk_zzaMoSs", durationMinutes: 30, maxOpens: 2 },
      },
      {
        id: "p_m3_2",
        order: 2,
        type: "pdf",
        title: "Inclined Plane Summary",
        required: true,
        pdf: { fileName: "mechanics-03-summary.pdf", url: SAMPLE_PDF, pages: 9 },
      },
      {
        id: "p_m3_3",
        order: 3,
        type: "homework",
        title: "Friction Homework",
        required: true,
        homework: {
          mode: "test",
          instructions: "Answer the following homework questions.",
          totalDegree: 20,
          questions: [
            mcq(
              "q_h3_1",
              "The coefficient of friction between two surfaces is defined as the ratio of limiting friction to:",
              10,
              ["Weight", "Normal reaction", "Applied force", "Mass"],
              1,
            ),
            {
              id: "q_h3_2",
              type: "written",
              text: "Explain why the angle of friction is independent of the mass of the body.",
              degree: 10,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ses_alg_01",
    name: "Algebra — Session 01",
    categoryId: "cat_alg",
    level: "3rd Secondary",
    cover: coverAlgebra,
    price: 90,
    description:
      "Matrices and determinants from first principles up to solving systems of equations.",
    learningMinutes: 85,
    accessDays: 7,
    published: true,
    publishedAt: daysAgo(30),
    parts: [
      {
        id: "p_a1_1",
        order: 1,
        type: "video",
        title: "Matrix Operations",
        required: true,
        video: { youtubeId: "fNk_zzaMoSs", durationMinutes: 26, maxOpens: 2 },
      },
      {
        id: "p_a1_2",
        order: 2,
        type: "pdf",
        title: "Algebra 01 Notes",
        required: true,
        pdf: { fileName: "algebra-01-notes.pdf", url: SAMPLE_PDF, pages: 10 },
      },
    ],
  },
  {
    id: "ses_alg_02",
    name: "Algebra — Session 02",
    categoryId: "cat_alg",
    level: "3rd Secondary",
    cover: coverAlgebra,
    price: 110,
    description: "Complex numbers, Argand diagrams and De Moivre's theorem.",
    learningMinutes: 95,
    accessDays: 14,
    published: true,
    publishedAt: daysAgo(4),
    prerequisiteSessionId: "ses_alg_01",
    parts: [
      {
        id: "p_a2_1",
        order: 1,
        type: "video",
        title: "Complex Numbers in the Plane",
        required: true,
        video: { youtubeId: "WUvTyaaNkzM", durationMinutes: 31, maxOpens: 2 },
      },
      {
        id: "p_a2_2",
        order: 2,
        type: "test",
        title: "Complex Numbers Quiz",
        required: true,
        test: {
          totalDegree: 20,
          passingDegree: 12,
          durationMinutes: 12,
          questions: [
            mcq("q_a2_1", "The value of i⁴ is:", 10, ["1", "-1", "i", "-i"], 0),
            mcq(
              "q_a2_2",
              "The modulus of the complex number 3 + 4i is:",
              10,
              ["7", "5", "25", "1"],
              1,
            ),
          ],
        },
      },
    ],
  },
  {
    id: "ses_calc_01",
    name: "Calculus — Session 01",
    categoryId: "cat_calc",
    level: "3rd Secondary",
    cover: coverCalculus,
    price: 130,
    description:
      "Limits, continuity and the definition of the derivative with graphical intuition.",
    learningMinutes: 120,
    accessDays: 21,
    published: true,
    publishedAt: daysAgo(2),
    parts: [
      {
        id: "p_c1_1",
        order: 1,
        type: "video",
        title: "The Essence of Limits",
        required: true,
        video: { youtubeId: "WUvTyaaNkzM", durationMinutes: 38, maxOpens: 2 },
      },
      {
        id: "p_c1_2",
        order: 2,
        type: "pdf",
        title: "Limits Reference Sheet",
        required: true,
        pdf: { fileName: "calculus-01-limits.pdf", url: SAMPLE_PDF, pages: 8 },
      },
      {
        id: "p_c1_3",
        order: 3,
        type: "test",
        title: "Limits Test",
        required: true,
        test: {
          totalDegree: 20,
          passingDegree: 14,
          durationMinutes: 15,
          questions: [
            mcq(
              "q_c1_1",
              "The limit of (x² - 1)/(x - 1) as x approaches 1 is:",
              10,
              ["0", "1", "2", "Undefined"],
              2,
            ),
            {
              id: "q_c1_2",
              type: "written",
              text: "Define continuity of a function at a point x = a.",
              degree: 10,
            },
          ],
        },
      },
    ],
  },
];

export const BOOKS: Book[] = [
  {
    id: "bk_1",
    name: "Mechanics Full Reference",
    level: "3rd Secondary",
    kind: "physical",
    cover: bookPhysical,
    description:
      "Printed 320-page reference covering the full mechanics syllabus with 600 solved problems.",
    price: 150,
    available: true,
  },
  {
    id: "bk_2",
    name: "Algebra Problem Bank",
    level: "3rd Secondary",
    kind: "digital",
    cover: bookDigital,
    description:
      "Digital problem bank with 450 graded algebra questions and full answer keys.",
    price: 75,
    available: true,
    pdfUrl: SAMPLE_PDF,
  },
  {
    id: "bk_3",
    name: "Calculus Final Revision",
    level: "3rd Secondary",
    kind: "digital",
    cover: bookDigital,
    description: "Condensed calculus revision pack for the final two weeks before the exam.",
    price: 60,
    available: true,
    pdfUrl: SAMPLE_PDF,
  },
  {
    id: "bk_4",
    name: "Geometry Workbook",
    level: "2nd Secondary",
    kind: "physical",
    cover: bookPhysical,
    description: "Not visible to 3rd Secondary students.",
    price: 120,
    available: true,
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n_1",
    title: "Calculus — Session 01 is now available",
    message:
      "The first calculus session of the term has been published for 3rd Secondary. Access lasts 21 days from your purchase date.",
    image: coverCalculus,
    date: daysAgo(2),
    read: false,
  },
  {
    id: "n_2",
    title: "Homework grading completed",
    message:
      "Your Mechanics Session 02 homework has been reviewed. Open My Learning to see your grade and feedback.",
    date: daysAgo(3),
    read: false,
  },
  {
    id: "n_3",
    title: "Physical class attendance",
    message:
      "Bring your student QR code to Saturday's revision class. Attendance is recorded by QR check-in at the door.",
    date: daysAgo(8),
    read: true,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "t_1",
    date: daysAgo(30),
    type: "Fawry Recharge",
    description: "Wallet recharge via Fawry",
    amount: 500,
    balanceAfter: 500,
  },
  {
    id: "t_2",
    date: daysAgo(28),
    type: "Session Purchase",
    description: "Mechanics — Session 01",
    amount: -100,
    balanceAfter: 400,
  },
  {
    id: "t_3",
    date: daysAgo(20),
    type: "Fawry Recharge",
    description: "Wallet recharge via Fawry",
    amount: 300,
    balanceAfter: 700,
  },
  {
    id: "t_4",
    date: daysAgo(18),
    type: "Session Purchase",
    description: "Mechanics — Session 02",
    amount: -120,
    balanceAfter: 580,
  },
  {
    id: "t_5",
    date: daysAgo(12),
    type: "Session Purchase",
    description: "Algebra — Session 01",
    amount: -90,
    balanceAfter: 490,
  },
  {
    id: "t_6",
    date: daysAgo(10),
    type: "Book Purchase",
    description: "Algebra Problem Bank (PDF)",
    amount: -75,
    balanceAfter: 415,
  },
  {
    id: "t_7",
    date: daysAgo(5),
    type: "Refund",
    description: "Goodwill refund — duplicate Fawry payment",
    amount: 100,
    balanceAfter: 515,
  },
  {
    id: "t_8",
    date: daysAgo(4),
    type: "Book Purchase",
    description: "Calculus Final Revision (PDF)",
    amount: -60,
    balanceAfter: 455,
  },
  {
    id: "t_9",
    date: daysAgo(3),
    type: "Session Purchase",
    description: "Mechanics — Session 03",
    amount: -100,
    balanceAfter: 355,
  },
  {
    id: "t_10",
    date: daysAgo(1),
    type: "Fawry Recharge",
    description: "Wallet recharge via Fawry",
    amount: 45,
    balanceAfter: 400,
  },
];
