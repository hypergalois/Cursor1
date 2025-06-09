import React, { useState } from "react";
import { ProblemList } from "../components/ProblemList";
import { ProblemCard } from "../components/ProblemCard";
import { Problem } from "../types/Problem";
import { problemService } from "../services/problemService";

export const HomePage: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [showList, setShowList] = useState(true);

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowList(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect && selectedProblem) {
      setScore((prevScore) => prevScore + selectedProblem.points);
    }
  };

  const handleBackToList = () => {
    setSelectedProblem(null);
    setShowList(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Minotauro - Problemas Matemáticos
            </h1>
            <div className="text-lg font-semibold text-green-600">
              Puntuación: {score}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showList ? (
          <ProblemList onProblemSelect={handleProblemSelect} />
        ) : selectedProblem ? (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ← Volver a la lista
            </button>
            <ProblemCard problem={selectedProblem} onAnswer={handleAnswer} />
          </div>
        ) : null}
      </main>
    </div>
  );
};
