export interface Problem {
  id: string;
  quest_esp: string;
  text_esp: string;
  correct_answer: string;
  wrong_answers: string[];
  image?: string;
  competence: string;
  level: number;
}

export const mockProblems: Problem[] = [
  {
    id: "mock-1",
    quest_esp: "Resuelve la ecuación",
    text_esp: "Si x + 5 = 12, ¿cuál es el valor de x?",
    correct_answer: "7",
    wrong_answers: ["5", "8", "10"],
    competence: "Álgebra",
    level: 1,
  },
  {
    id: "mock-2",
    quest_esp: "Calcula el área",
    text_esp:
      "¿Cuál es el área de un rectángulo de 6cm de base y 4cm de altura?",
    correct_answer: "24 cm²",
    wrong_answers: ["20 cm²", "28 cm²", "16 cm²"],
    competence: "Geometría",
    level: 1,
  },
  {
    id: "mock-3",
    quest_esp: "Resuelve la fracción",
    text_esp: "¿Cuál es el resultado de 3/4 + 1/2?",
    correct_answer: "5/4",
    wrong_answers: ["4/6", "6/8", "7/8"],
    competence: "Fracciones",
    level: 2,
  },
  {
    id: "mock-4",
    quest_esp: "Calcula el porcentaje",
    text_esp: "¿Cuál es el 25% de 80?",
    correct_answer: "20",
    wrong_answers: ["25", "15", "30"],
    competence: "Porcentajes",
    level: 2,
  },
  {
    id: "mock-5",
    quest_esp: "Resuelve la ecuación cuadrática",
    text_esp: "¿Cuál es el valor de x en la ecuación x² + 5x + 6 = 0?",
    correct_answer: "-2 o -3",
    wrong_answers: ["2 o 3", "-1 o -4", "1 o 4"],
    competence: "Álgebra",
    level: 3,
  },
];
