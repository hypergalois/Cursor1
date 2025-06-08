import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  level: number;
  problemsSolved: number;
  correctAnswers: number;
  totalStars: number;
  competences: {
    [key: string]: number;
  };
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  addProblemSolved: (isCorrect: boolean) => void;
  updateCompetence: (competence: string, progress: number) => void;
}

const initialUser: User = {
  name: "Aventurero",
  level: 1,
  problemsSolved: 0,
  correctAnswers: 0,
  totalStars: 0,
  competences: {
    Álgebra: 0,
    Geometría: 0,
    Fracciones: 0,
    Porcentajes: 0,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(initialUser);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addProblemSolved = (isCorrect: boolean) => {
    setUser((prev) => ({
      ...prev,
      problemsSolved: prev.problemsSolved + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      totalStars: isCorrect ? prev.totalStars + 3 : prev.totalStars,
      level: Math.floor((prev.problemsSolved + 1) / 5) + 1,
    }));
  };

  const updateCompetence = (competence: string, progress: number) => {
    setUser((prev) => ({
      ...prev,
      competences: {
        ...prev.competences,
        [competence]: Math.min(100, Math.max(0, progress)),
      },
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        addProblemSolved,
        updateCompetence,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
