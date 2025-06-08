export const calculateScore = (
  isCorrect: boolean,
  timeSpent: number,
  difficulty: number
): number => {
  if (!isCorrect) return 0;

  // Base score for correct answer
  let score = 3;

  // Time bonus (max 2 points)
  const timeBonus = Math.max(0, 2 - Math.floor(timeSpent / 30));
  score += timeBonus;

  // Difficulty bonus (max 1 point)
  const difficultyBonus = Math.min(1, difficulty / 3);
  score += difficultyBonus;

  return Math.round(score);
};

export const getStarRating = (score: number): number => {
  if (score >= 5) return 3;
  if (score >= 3) return 2;
  if (score >= 1) return 1;
  return 0;
};

export const getFeedbackMessage = (score: number): string => {
  if (score >= 5) return "¡Excelente trabajo! ¡Eres un genio!";
  if (score >= 3) return "¡Buen trabajo! ¡Sigue así!";
  if (score >= 1) return "¡Bien! Con práctica mejorarás.";
  return "¡No te preocupes! Sigue intentando.";
};
