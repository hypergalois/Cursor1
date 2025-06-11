import React, { useEffect, useState } from "react";
import { Problem } from "../types/Problem";
import { problemService } from "../services/problemService";

interface ProblemListProps {
  onProblemSelect: (problem: Problem) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  onProblemSelect,
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemService.getProblems();
        setProblems(data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los problemas");
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {problems.map((problem) => (
        <div
          key={problem.id}
          onClick={() => onProblemSelect(problem)}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {problem.question}
            </h3>
            <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              Nivel {problem.level}
            </span>
          </div>

          <div className="space-y-2">
            {problem.options.map((option, index) => (
              <div
                key={index}
                className="p-2 rounded border border-gray-200 hover:bg-gray-50"
              >
                {option}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Categoría: {problem.category}
            </span>
            <span className="text-sm font-medium text-green-600">
              {problem.points} puntos
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
