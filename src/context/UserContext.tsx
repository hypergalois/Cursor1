import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Estructura minimalista de progreso de usuario
export interface UserStats {
  xp: number; // Puntos de experiencia totales
  level: number; // Nivel actual calculado en base al XP
  stars: number; // Estrellas acumuladas
  streak: number; // Racha de respuestas correctas consecutivas
}

interface UserContextType {
  stats: UserStats;
  addXP: (amount: number) => void;
  addStar: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

const STORAGE_KEY = "@minotauro_user_stats";

const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  stars: 0,
  streak: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Cargar progreso guardado al montar la app
  useEffect(() => {
    const loadStats = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setStats(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Error cargando progreso de usuario", e);
      }
    };
    loadStats();
  }, []);

  const persist = (newStats: UserStats) => {
    setStats(newStats);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStats)).catch((e) =>
      console.warn("Error guardando progreso", e)
    );
  };

  // Nivel = 1 + (XP / 100) truncado
  const getLevelForXP = (xp: number) => Math.floor(xp / 100) + 1;

  const addXP = (amount: number) => {
    const newXP = stats.xp + amount;
    const newLevel = getLevelForXP(newXP);
    persist({ ...stats, xp: newXP, level: newLevel });
  };

  const addStar = (amount: number) => {
    persist({ ...stats, stars: stats.stars + amount });
  };

  const incrementStreak = () => {
    persist({ ...stats, streak: stats.streak + 1 });
  };

  const resetStreak = () => {
    if (stats.streak !== 0) {
      persist({ ...stats, streak: 0 });
    }
  };

  return (
    <UserContext.Provider
      value={{ stats, addXP, addStar, incrementStreak, resetStreak }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};
