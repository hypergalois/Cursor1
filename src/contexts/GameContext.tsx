import React, { createContext, useContext, ReactNode } from "react";
import { useGameLoop, GameState, GameActions } from "../hooks/useGameLoop";

interface GameContextType {
  gameState: GameState;
  gameActions: GameActions;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, gameActions] = useGameLoop();

  const value = {
    gameState,
    gameActions,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
