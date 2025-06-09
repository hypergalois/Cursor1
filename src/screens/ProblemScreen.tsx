import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  animations,
} from "../styles/theme";
import { GameHeader } from "../components/GameHeader";
import MinoMascot from "../components/MinoMascot";
import SceneAssets from "../components/SceneAssets";
import ProblemEffects from "../components/ProblemEffects";
import AdaptiveDifficulty from "../utils/AdaptiveDifficulty";
import UserProgressService from "../services/UserProgress";

interface ProblemScreenProps {
  navigation: any;
  route: any;
}

interface Problem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  type: "suma" | "resta" | "multiplicacion" | "division";
  hint?: string;
  explanation?: string;
}

const { width } = Dimensions.get("window");

export const ProblemScreen: React.FC<ProblemScreenProps> = ({
  navigation,
  route,
}) => {
  // Parámetros de navegación
  const {
    problemType = "suma",
    difficulty = "easy",
    currentScene = "entrance",
    currentLevel = 1,
    nextScene,
    problemsInSession = 1,
  } = route?.params || {};

  // Estados del componente
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [xp, setXp] = useState(150);
  const [currentEffect, setCurrentEffect] = useState<
    "correct" | "incorrect" | "streak" | "hint" | "celebration" | "none"
  >("none");
  const [showEffect, setShowEffect] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [adaptiveDifficulty] = useState(() => AdaptiveDifficulty.getInstance());
  const [userProgress] = useState(() => UserProgressService.getInstance());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [autoNavTimer, setAutoNavTimer] = useState<NodeJS.Timeout | null>(null);
  const lastProblemIdRef = useRef<string>("");

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ✅ FUNCIÓN DE RESETEO COMPLETO DEL ESTADO
  const resetProblemState = () => {
    console.log("🔄 Reseteando estado de ProblemScreen");

    // Limpiar timer si existe
    if (autoNavTimer) {
      clearTimeout(autoNavTimer);
      setAutoNavTimer(null);
    }

    // Resetear todos los estados relacionados con el problema
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setCurrentEffect("none");
    setShowEffect(false);
    setHintsUsed(0);
    setIsNavigating(false);

    // Resetear animaciones
    fadeAnim.setValue(0);
    shakeAnim.setValue(0);
    scaleAnim.setValue(1);
    progressAnim.setValue(0);
  };

  // Sistema de generación de problemas por escena
  const generateProblemByScene = (): Problem => {
    const problemGenerators = {
      entrance: generateBasicProblem,
      golden_room: generateGoldenProblem,
      mystery_tunnel: generateMysteryProblem,
      tower: generateTowerProblem,
      treasure_cave: generateTreasureProblem,
      fire_chamber: generateFireProblem,
      ice_chamber: generateIceProblem,
      boss_room: generateBossProblem,
    };

    const generator =
      problemGenerators[currentScene as keyof typeof problemGenerators] ||
      generateBasicProblem;

    let newProblem: Problem;
    let attempts = 0;
    const maxAttempts = 5;

    // ✅ EVITAR PROBLEMA DUPLICADO
    do {
      newProblem = generator();
      attempts++;

      if (attempts >= maxAttempts) {
        // Si después de 5 intentos sigue siendo el mismo, forzar un ID único
        newProblem.id = `${currentScene}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        break;
      }
    } while (
      newProblem.id === lastProblemIdRef.current &&
      attempts < maxAttempts
    );

    console.log(`🆕 Nuevo problema generado:`, {
      id: newProblem.id,
      scene: currentScene,
      type: problemType,
      lastProblemId: lastProblemIdRef.current,
      attempts,
    });

    lastProblemIdRef.current = newProblem.id;
    return newProblem;
  };

  // Generadores de problemas específicos por escena
  const generateBasicProblem = (): Problem => {
    const operations = {
      suma: () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const answer = a + b;
        return {
          question: `🏰 En la entrada, encuentras ${a} monedas de oro y ${b} monedas de plata. ¿Cuántas monedas tienes en total?`,
          answer,
          explanation: `${a} + ${b} = ${answer}`,
        };
      },
      resta: () => {
        const a = Math.floor(Math.random() * 30) + 20;
        const b = Math.floor(Math.random() * 15) + 1;
        const answer = a - b;
        return {
          question: `🚪 Tienes ${a} llaves, pero usas ${b} para abrir puertas. ¿Cuántas llaves te quedan?`,
          answer,
          explanation: `${a} - ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] || operations.suma;
    const { question, answer, explanation } = operation();

    return {
      id: `entrance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
    };
  };

  const generateGoldenProblem = (): Problem => {
    const operations = {
      suma: () => {
        const a = Math.floor(Math.random() * 50) + 25;
        const b = Math.floor(Math.random() * 50) + 25;
        const answer = a + b;
        return {
          question: `✨ En la sala dorada, hay ${a} gemas rojas y ${b} gemas azules brillando. ¿Cuántas gemas hay en total?`,
          answer,
          explanation: `${a} + ${b} = ${answer}`,
        };
      },
      multiplicacion: () => {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const answer = a * b;
        return {
          question: `💰 Encuentras ${a} cofres, cada uno con ${b} monedas doradas. ¿Cuántas monedas tienes?`,
          answer,
          explanation: `${a} × ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] || operations.suma;
    const { question, answer, explanation } = operation();

    return {
      id: `golden_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
      hint: "💡 Recuerda que multiplicar es sumar varias veces el mismo número.",
    };
  };

  const generateMysteryProblem = (): Problem => {
    const operations = {
      resta: () => {
        const a = Math.floor(Math.random() * 80) + 40;
        const b = Math.floor(Math.random() * 30) + 10;
        const answer = a - b;
        return {
          question: `🌀 En el túnel misterioso, tu antorcha tenía ${a} minutos de luz, pero has usado ${b} minutos explorando. ¿Cuántos minutos te quedan?`,
          answer,
          explanation: `${a} - ${b} = ${answer}`,
        };
      },
      division: () => {
        const answer = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const a = answer * b;
        return {
          question: `🔮 Encuentras ${a} cristales mágicos que debes repartir en ${b} grupos iguales. ¿Cuántos cristales van en cada grupo?`,
          answer,
          explanation: `${a} ÷ ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] || operations.resta;
    const { question, answer, explanation } = operation();

    return {
      id: `mystery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
      hint: "🔍 En la división, pregúntate: ¿cuántas veces cabe el divisor en el dividendo?",
    };
  };

  const generateTowerProblem = (): Problem => {
    const operations = {
      multiplicacion: () => {
        const a = Math.floor(Math.random() * 12) + 3;
        const b = Math.floor(Math.random() * 12) + 3;
        const answer = a * b;
        return {
          question: `🏗️ La torre tiene ${a} pisos, y cada piso tiene ${b} ventanas mágicas. ¿Cuántas ventanas hay en total?`,
          answer,
          explanation: `${a} × ${b} = ${answer}`,
        };
      },
      suma: () => {
        const a = Math.floor(Math.random() * 100) + 50;
        const b = Math.floor(Math.random() * 100) + 50;
        const answer = a + b;
        return {
          question: `⚡ El mago conjura ${a} chispas de energía y luego ${b} más. ¿Cuántas chispas hay en total?`,
          answer,
          explanation: `${a} + ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] ||
      operations.multiplicacion;
    const { question, answer, explanation } = operation();

    return {
      id: `tower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
      hint: "🪄 La magia de la multiplicación: suma repetida!",
    };
  };

  const generateTreasureProblem = (): Problem => {
    const operations = {
      suma: () => {
        const nums = Array.from(
          { length: 3 },
          () => Math.floor(Math.random() * 50) + 20
        );
        const answer = nums.reduce((sum, num) => sum + num, 0);
        return {
          question: `💎 En la caverna encuentras tres tesoros: ${nums[0]} diamantes, ${nums[1]} rubíes y ${nums[2]} esmeraldas. ¿Cuántas gemas tienes?`,
          answer,
          explanation: `${nums.join(" + ")} = ${answer}`,
        };
      },
      multiplicacion: () => {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 15) + 5;
        const answer = a * b;
        return {
          question: `⛏️ Cada golpe de pico te da ${a} pepitas de oro. Das ${b} golpes. ¿Cuántas pepitas obtienes?`,
          answer,
          explanation: `${a} × ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] || operations.suma;
    const { question, answer, explanation } = operation();

    return {
      id: `treasure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
      hint: "💰 ¡Los tesoros se acumulan sumando o multiplicando!",
    };
  };

  const generateFireProblem = (): Problem => {
    const operations = {
      division: () => {
        const answer = Math.floor(Math.random() * 15) + 3;
        const b = Math.floor(Math.random() * 6) + 2;
        const a = answer * b;
        return {
          question: `🔥 El dragón escupe ${a} bolas de fuego en ${b} ráfagas iguales. ¿Cuántas bolas de fuego por ráfaga?`,
          answer,
          explanation: `${a} ÷ ${b} = ${answer}`,
        };
      },
      multiplicacion: () => {
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 8) + 3;
        const answer = a * b;
        return {
          question: `🌋 Cada erupción lanza ${a} rocas ardientes, y hay ${b} erupciones. ¿Cuántas rocas en total?`,
          answer,
          explanation: `${a} × ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] || operations.division;
    const { question, answer, explanation } = operation();

    return {
      id: `fire_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
      hint: "🔥 ¡El fuego se divide o se multiplica con intensidad!",
    };
  };

  const generateIceProblem = (): Problem => {
    const operations = {
      resta: () => {
        const a = Math.floor(Math.random() * 150) + 100;
        const b = Math.floor(Math.random() * 50) + 20;
        const answer = a - b;
        return {
          question: `❄️ Tienes ${a} copos de nieve mágicos, pero el viento se lleva ${b}. ¿Cuántos te quedan?`,
          answer,
          explanation: `${a} - ${b} = ${answer}`,
        };
      },
      division: () => {
        const answer = Math.floor(Math.random() * 12) + 4;
        const b = Math.floor(Math.random() * 6) + 2;
        const a = answer * b;
        return {
          question: `🧊 Hay ${a} cristales de hielo que se forman en ${b} grupos iguales. ¿Cuántos cristales por grupo?`,
          answer,
          explanation: `${a} ÷ ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] || operations.resta;
    const { question, answer, explanation } = operation();

    return {
      id: `ice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
      hint: "❄️ El hielo puede fragmentarse (división) o derretirse (resta).",
    };
  };

  const generateBossProblem = (): Problem => {
    const operations = {
      multiplicacion: () => {
        const a = Math.floor(Math.random() * 25) + 15;
        const b = Math.floor(Math.random() * 25) + 15;
        const answer = a * b;
        return {
          question: `👑 El jefe final tiene ${a} puntos de vida por cada una de sus ${b} formas. ¿Cuántos puntos de vida total?`,
          answer,
          explanation: `${a} × ${b} = ${answer}`,
        };
      },
      division: () => {
        const answer = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 8) + 3;
        const a = answer * b;
        return {
          question: `⚔️ Infliges ${a} puntos de daño repartidos en ${b} ataques iguales. ¿Cuánto daño por ataque?`,
          answer,
          explanation: `${a} ÷ ${b} = ${answer}`,
        };
      },
    };

    const operation =
      operations[problemType as keyof typeof operations] ||
      operations.multiplicacion;
    const { question, answer, explanation } = operation();

    return {
      id: `boss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options: generateOptions(answer),
      correctAnswer: answer,
      difficulty,
      type: problemType as any,
      explanation,
      hint: "⚡ ¡El poder del jefe final requiere cálculos precisos!",
    };
  };

  // Generar opciones de respuesta con dificultad adaptativa
  const generateOptions = (correctAnswer: number): string[] => {
    const options = [correctAnswer.toString()];
    const difficultyModifiers = adaptiveDifficulty.getDifficultyModifiers();
    const rangeMultiplier = difficultyModifiers.rangeMultiplier;

    while (options.length < 4) {
      let option: number;

      if (correctAnswer <= 10) {
        const baseRange = Math.floor(20 * rangeMultiplier);
        option = Math.floor(Math.random() * baseRange) + 1;
      } else if (correctAnswer <= 100) {
        const variance = Math.floor(correctAnswer * 0.3 * rangeMultiplier);
        option =
          correctAnswer + (Math.floor(Math.random() * variance * 2) - variance);
      } else {
        const variance = Math.floor(correctAnswer * 0.2 * rangeMultiplier);
        option =
          correctAnswer + (Math.floor(Math.random() * variance * 2) - variance);
      }

      // Ajustar según nivel de complejidad
      if (difficultyModifiers.complexityLevel >= 3) {
        // Hacer opciones más cercanas para mayor dificultad
        const closeVariance = Math.max(1, Math.floor(correctAnswer * 0.1));
        option =
          correctAnswer +
          (Math.floor(Math.random() * closeVariance * 2) - closeVariance);
      }

      if (option > 0 && !options.includes(option.toString())) {
        options.push(option.toString());
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  // ✅ EFECTO QUE SE EJECUTA CADA VEZ QUE LA PANTALLA SE ENFOCA
  useFocusEffect(
    React.useCallback(() => {
      console.log("🎯 ProblemScreen enfocada - Inicializando problema");

      const initializeProblem = async () => {
        try {
          // ✅ RESETEAR ESTADO COMPLETAMENTE
          resetProblemState();

          // Inicializar sesión si no existe
          if (!userProgress.getCurrentSession()) {
            await userProgress.startSession();
          }

          // ✅ GENERAR NUEVO PROBLEMA (evitando duplicados)
          const problem = generateProblemByScene();
          setCurrentProblem(problem);
          setStartTime(Date.now());

          console.log("✅ Problema inicializado:", {
            id: problem.id,
            question: problem.question.substring(0, 50) + "...",
            scene: currentScene,
            type: problemType,
          });

          // Animación de entrada
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(progressAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
          ]).start();
        } catch (error) {
          console.error("❌ Error inicializando problema:", error);
        }
      };

      initializeProblem();

      // Cleanup cuando la pantalla se desenfoca
      return () => {
        console.log("👋 ProblemScreen desenfocada - Limpiando");
        if (autoNavTimer) {
          clearTimeout(autoNavTimer);
        }
      };
    }, [currentScene, problemType])
  );

  // ✅ EL CLEANUP YA SE MANEJA EN useFocusEffect

  // ✅ FUNCIÓN DE NAVEGACIÓN AUTOMÁTICA
  const handleAutoNavigation = (
    correct: boolean,
    xpGained: number,
    timeSpent: number,
    streakCount: number
  ) => {
    if (isNavigating) return;
    setIsNavigating(true);

    console.log("🚀 Navegando a ResultScreen:", {
      problemId: currentProblem?.id,
      correct,
      xpGained,
      timeSpent,
      streakCount,
      currentScene,
    });

    // Navegar a ResultScreen con todos los datos necesarios
    navigation.navigate("Result", {
      isCorrect: correct,
      xpGained,
      timeSpent,
      streak: streakCount,
      currentScene,
      nextScene,
      currentLevel,
      difficulty,
      problemType,
      sessionType: "single",
      problemsInSession,
    });
  };

  const handleAnswerSelect = async (answerIndex: number) => {
    if (isAnswered || isNavigating) return;

    console.log("📝 Usuario respondió:", {
      problemId: currentProblem?.id,
      answerIndex,
      selectedOption: currentProblem?.options[answerIndex],
      correctAnswer: currentProblem?.correctAnswer.toString(),
    });

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const correct =
      currentProblem?.options[answerIndex] ===
      currentProblem?.correctAnswer.toString();
    setIsCorrect(correct);

    // Calcular tiempo empleado
    const timeSpent = (Date.now() - startTime) / 1000;

    // Actualizar sistema adaptativo
    adaptiveDifficulty.updatePerformance(correct, timeSpent, currentLevel);

    let xpGained = 10;
    let newStreak = correct ? streak + 1 : 0;

    if (correct) {
      // Respuesta correcta
      setStreak(newStreak);

      // Calcular XP con bonificaciones
      const difficultyModifiers = adaptiveDifficulty.getDifficultyModifiers();

      // Bonus por dificultad
      if (difficultyModifiers.complexityLevel >= 3) xpGained += 5;
      if (difficultyModifiers.complexityLevel >= 4) xpGained += 10;

      // Bonus por velocidad
      if (difficultyModifiers.timeBonus && timeSpent < 10) xpGained += 5;

      // Bonus por racha
      if (newStreak >= 3) xpGained += newStreak * 2;

      setXp((prev) => prev + xpGained);

      // Determinar tipo de efecto
      if (newStreak >= 5) {
        setCurrentEffect("celebration");
      } else if (newStreak >= 3) {
        setCurrentEffect("streak");
      } else {
        setCurrentEffect("correct");
      }

      setShowEffect(true);

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Respuesta incorrecta
      setLives((prev) => Math.max(0, prev - 1));
      setStreak(0);

      setCurrentEffect("incorrect");
      setShowEffect(true);

      // Animación de sacudida
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // ✅ REGISTRAR MÉTRICAS DEL PROBLEMA
    try {
      await userProgress.recordProblemResult({
        problemId: currentProblem?.id || `problem_${Date.now()}`,
        correct,
        timeTaken: timeSpent,
        difficulty: difficulty as any,
        category: currentScene,
        problemType: problemType as any,
        xpEarned: xpGained,
        hintsUsed,
        timestamp: Date.now(),
        currentLevel,
        streakBefore: streak,
        streakAfter: newStreak,
      });
    } catch (error) {
      console.error("Error registering problem result:", error);
    }

    // ✅ NAVEGACIÓN AUTOMÁTICA TRAS 3 SEGUNDOS
    const timer = setTimeout(() => {
      handleAutoNavigation(correct, xpGained, timeSpent, newStreak);
    }, 3000);

    setAutoNavTimer(timer);
  };

  const handleContinue = () => {
    if (isNavigating) return;

    // Cancelar navegación automática si existe
    if (autoNavTimer) {
      clearTimeout(autoNavTimer);
      setAutoNavTimer(null);
    }

    if (lives <= 0) {
      // Game Over
      Alert.alert(
        "💀 Aventura Terminada",
        "Te has quedado sin vidas. ¡Inténtalo de nuevo!",
        [{ text: "Reintentar", onPress: () => navigation.navigate("Dungeon") }]
      );
      return;
    }

    setIsNavigating(true);

    // Calcular datos para ResultScreen
    const timeSpent = (Date.now() - startTime) / 1000;
    const difficultyModifiers = adaptiveDifficulty.getDifficultyModifiers();
    let xpGained = 10;

    if (isCorrect) {
      // Calcular XP ganada
      if (difficultyModifiers.complexityLevel >= 3) xpGained += 5;
      if (difficultyModifiers.complexityLevel >= 4) xpGained += 10;
      if (difficultyModifiers.timeBonus && timeSpent < 10) xpGained += 5;
      if (streak >= 3) xpGained += streak * 2;
    }

    // Navegar a ResultScreen con todos los datos
    navigation.navigate("Result", {
      isCorrect,
      xpGained,
      timeSpent,
      streak,
      currentScene,
      nextScene,
      currentLevel,
      difficulty,
      problemType,
      sessionType: "single",
      problemsInSession,
    });
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed((prev) => prev + 1);
    setXp((prev) => Math.max(0, prev - 5)); // Cuesta XP usar pistas

    setCurrentEffect("hint");
    setShowEffect(true);
  };

  const getMascotMood = () => {
    if (!isAnswered) return "neutral";
    return isCorrect ? "happy" : "sad";
  };

  const handleEffectComplete = () => {
    setShowEffect(false);
    setCurrentEffect("none");
  };

  const getSceneContext = () => {
    const contexts = {
      entrance: {
        title: "🏰 Entrada de la Mazmorra",
        color: colors.primary.main,
      },
      golden_room: { title: "✨ Sala Dorada", color: "#ff8f00" },
      mystery_tunnel: { title: "🌀 Túnel Misterioso", color: "#4a148c" },
      tower: { title: "🏗️ Torre del Mago", color: "#0d47a1" },
      treasure_cave: { title: "💎 Caverna del Tesoro", color: "#1b5e20" },
      fire_chamber: { title: "🔥 Cámara de Fuego", color: "#bf360c" },
      ice_chamber: { title: "❄️ Cámara de Hielo", color: "#006064" },
      boss_room: { title: "👑 Sala del Jefe Final", color: "#263238" },
    };

    return contexts[currentScene as keyof typeof contexts] || contexts.entrance;
  };

  if (!currentProblem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <MinoMascot mood="neutral" size={100} />
          <Text style={styles.loadingText}>Preparando desafío...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sceneContext = getSceneContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      <GameHeader xp={xp} lives={lives} level={currentLevel} />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Contexto de la escena */}
        <View style={[styles.sceneHeader, { borderColor: sceneContext.color }]}>
          <SceneAssets sceneType={currentScene} size="small" />
          <View style={styles.sceneInfo}>
            <Text style={[styles.sceneTitle, { color: sceneContext.color }]}>
              {sceneContext.title}
            </Text>
            <Text style={styles.challengeText}>
              Desafío Matemático • {difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Pregunta */}
        <Animated.View
          style={[
            styles.questionContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <Text style={styles.questionText}>{currentProblem.question}</Text>

          {showHint && currentProblem.hint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{currentProblem.hint}</Text>
            </View>
          )}
        </Animated.View>

        {/* Opciones de respuesta */}
        <View style={styles.optionsContainer}>
          {currentProblem.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                isAnswered &&
                index ===
                  currentProblem.options.indexOf(
                    currentProblem.correctAnswer.toString()
                  )
                  ? styles.correctOption
                  : {},
                isAnswered && selectedAnswer === index && !isCorrect
                  ? styles.incorrectOption
                  : {},
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mascota con reacción */}
        <View style={styles.mascotContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <MinoMascot mood={getMascotMood()} size={120} />
          </Animated.View>

          {isAnswered && (
            <View style={styles.feedbackContainer}>
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color: isCorrect ? colors.success.main : colors.error.main,
                  },
                ]}
              >
                {isCorrect
                  ? adaptiveDifficulty.getEncouragementMessage()
                  : "¡Inténtalo de nuevo! 💪"}
              </Text>

              {currentProblem.explanation && (
                <Text style={styles.explanationText}>
                  {currentProblem.explanation}
                </Text>
              )}

              {/* Información del sistema adaptativo */}
              <View style={styles.adaptiveInfo}>
                <Text style={styles.adaptiveText}>
                  Nivel: {adaptiveDifficulty.getDifficultyDescription()}
                </Text>
                {streak > 0 && (
                  <Text style={styles.streakText}>
                    🔥 Racha: {streak} {streak > 1 ? "respuestas" : "respuesta"}{" "}
                    seguidas
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          {!isAnswered &&
            !showHint &&
            currentProblem.hint &&
            adaptiveDifficulty.getDifficultyModifiers().hintAvailability && (
              <TouchableOpacity style={styles.hintButton} onPress={handleHint}>
                <Text style={styles.hintButtonText}>💡 Pista (-5 XP)</Text>
              </TouchableOpacity>
            )}

          {isAnswered && (
            <View style={styles.navigationSection}>
              {/* Indicador de navegación automática */}
              {autoNavTimer && !isNavigating && (
                <View style={styles.autoNavIndicator}>
                  <Text style={styles.autoNavText}>
                    Navegando automáticamente en 3s...
                  </Text>
                  <View style={styles.progressIndicator}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                          }),
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  { backgroundColor: sceneContext.color },
                  isNavigating && styles.disabledButton,
                ]}
                onPress={handleContinue}
                disabled={isNavigating}
              >
                <Text style={styles.continueButtonText}>
                  {isNavigating
                    ? "Navegando..."
                    : autoNavTimer
                    ? "Continuar Ahora"
                    : "Continuar"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Efectos visuales */}
      <ProblemEffects
        effectType={currentEffect}
        isVisible={showEffect}
        onComplete={handleEffectComplete}
        streakCount={streak}
        sceneType={currentScene}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  loadingText: {
    ...typography.h2,
    color: colors.text.secondary,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  sceneHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    ...shadows.medium,
  },
  sceneInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  sceneTitle: {
    ...typography.h3,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  challengeText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  questionContainer: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  questionText: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 28,
  },
  hintContainer: {
    backgroundColor: colors.accent + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  hintText: {
    ...typography.body,
    color: colors.accent,
    fontStyle: "italic",
    lineHeight: 22,
  },
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  optionButton: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary.light,
    ...shadows.small,
  },
  selectedOption: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + "20",
  },
  correctOption: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light + "20",
  },
  incorrectOption: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.light + "20",
  },
  optionText: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: "center",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: colors.primary.main,
    fontWeight: "600",
  },
  mascotContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  feedbackContainer: {
    alignItems: "center",
    marginTop: spacing.md,
    maxWidth: width * 0.8,
  },
  feedbackText: {
    ...typography.h2,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  explanationText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  hintButton: {
    backgroundColor: colors.accent + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  hintButtonText: {
    ...typography.body,
    color: colors.accent,
    textAlign: "center",
    fontWeight: "600",
  },
  continueButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  continueButtonText: {
    ...typography.h3,
    color: colors.background.paper,
    textAlign: "center",
    fontWeight: "600",
  },
  adaptiveInfo: {
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.primary.light + "30",
  },
  adaptiveText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  streakText: {
    ...typography.body,
    color: colors.gold,
    fontWeight: "600",
    textAlign: "center",
  },
  navigationSection: {
    gap: spacing.md,
  },
  autoNavIndicator: {
    backgroundColor: colors.primary.light + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  autoNavText: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  progressIndicator: {
    width: "100%",
    height: 4,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ProblemScreen;
