import React, { createContext, useContext, useState, useEffect } from "react";
import { storageService } from "../services/StorageService";
import { syncService } from "../services/SyncService";
import { Problem } from "../types/Problem";

export interface GameState {
  level: number;
  experience: number;
  lives: number;
  hints: number;
  problems: Problem[];
  lastDailyReward: number | null;
  isOffline: boolean;
}

interface GameStateContextType {
  gameState: GameState;
  addExperience: (amount: number) => void;
  loseLife: () => void;
  useHint: () => void;
  claimDailyReward: () => void;
  loadProblems: () => Promise<void>;
  isOffline: boolean;
}

const initialState: GameState = {
  level: 1,
  experience: 0,
  lives: 3,
  hints: 3,
  problems: [],
  lastDailyReward: null,
  isOffline: false,
};

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    try {
      // Check if device is online
      const isOnline = await syncService.isDeviceOnline();

      // Load saved game state
      const savedState = await storageService.getGameState();
      if (savedState) {
        setGameState((prev) => ({
          ...prev,
          ...savedState,
          isOffline: !isOnline,
        }));
      }

      // Load problems
      await loadProblems();
    } catch (error) {
      console.error("Error loading initial state:", error);
    }
  };

  const loadProblems = async () => {
    try {
      const problems = await syncService.getProblems();
      setGameState((prev) => ({
        ...prev,
        problems,
      }));
    } catch (error) {
      console.error("Error loading problems:", error);
    }
  };

  const saveGameState = async (newState: GameState) => {
    try {
      await storageService.saveGameState(newState);
      if (!newState.isOffline) {
        await syncService.syncData();
      }
    } catch (error) {
      console.error("Error saving game state:", error);
    }
  };

  const addExperience = async (amount: number) => {
    const newState = {
      ...gameState,
      experience: gameState.experience + amount,
      level: Math.floor((gameState.experience + amount) / 100) + 1,
    };

    setGameState(newState);
    await saveGameState(newState);

    // Save progress locally if offline
    if (gameState.isOffline) {
      await syncService.saveProgressLocally({
        experience: newState.experience,
        score: amount,
      });
    }
  };

  const loseLife = async () => {
    const newState = {
      ...gameState,
      lives: Math.max(0, gameState.lives - 1),
    };

    setGameState(newState);
    await saveGameState(newState);
  };

  const useHint = async () => {
    if (gameState.hints > 0) {
      const newState = {
        ...gameState,
        hints: gameState.hints - 1,
      };

      setGameState(newState);
      await saveGameState(newState);
    }
  };

  const claimDailyReward = async () => {
    const now = Date.now();
    const newState = {
      ...gameState,
      lastDailyReward: now,
      hints: gameState.hints + 1,
      lives: Math.min(5, gameState.lives + 1),
    };

    setGameState(newState);
    await saveGameState(newState);

    // Save progress locally if offline
    if (gameState.isOffline) {
      await syncService.saveProgressLocally({
        timestamp: now,
      });
    }
  };

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        addExperience,
        loseLife,
        useHint,
        claimDailyReward,
        loadProblems,
        isOffline: gameState.isOffline,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
