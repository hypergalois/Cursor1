import { Problem } from "../types/Problem";

export const mockProblems: Problem[] = [
  {
    id: "1",
    question: "¿Cuánto es 5 + 7?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 1, // 12
    explanation: "5 + 7 = 12. Sumamos 5 y 7 para obtener 12.",
    difficulty: "easy",
    category: "suma",
    points: 10,
    level: 1,
    hint: "Piensa en contar 5 unidades más 7 unidades.",
  },
  {
    id: "2",
    question: "¿Cuánto es 8 × 6?",
    options: ["42", "48", "54", "56"],
    correctAnswer: 1, // 48
    explanation: "8 × 6 = 48. Multiplicamos 8 por 6 para obtener 48.",
    difficulty: "medium",
    category: "multiplicación",
    points: 15,
    level: 1,
    hint: "Puedes sumar 8 seis veces: 8 + 8 + 8 + 8 + 8 + 8",
  },
  {
    id: "3",
    question: "¿Cuánto es 20 ÷ 4?",
    options: ["4", "5", "6", "8"],
    correctAnswer: 1, // 5
    explanation: "20 ÷ 4 = 5. Dividimos 20 entre 4 para obtener 5.",
    difficulty: "easy",
    category: "división",
    points: 10,
    level: 1,
    hint: "¿Cuántas veces cabe el 4 en 20?",
  },
  {
    id: "4",
    question: "¿Cuánto es 15 - 8?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2, // 7
    explanation: "15 - 8 = 7. Restamos 8 de 15 para obtener 7.",
    difficulty: "easy",
    category: "resta",
    points: 10,
    level: 1,
    hint: "Cuenta hacia atrás desde 15 ocho veces.",
  },
  {
    id: "5",
    question: "¿Cuánto es 9²?",
    options: ["81", "72", "63", "54"],
    correctAnswer: 0, // 81
    explanation: "9² = 81. Multiplicamos 9 por sí mismo para obtener 81.",
    difficulty: "medium",
    category: "potencias",
    points: 15,
    level: 2,
    hint: "9² significa 9 × 9",
  },
];
