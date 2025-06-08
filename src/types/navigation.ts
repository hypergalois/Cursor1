export type RootStackParamList = {
  Home: undefined;
  Exploration: undefined;
  Problem: { problemId: string };
  Result: {
    problemId: string;
    isCorrect: boolean;
    score: number;
  };
  Progress: undefined;
  Profile: undefined;
};
