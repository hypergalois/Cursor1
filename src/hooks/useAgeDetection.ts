import { useState, useEffect, useCallback } from "react";
import AgeDetectionService, {
  AgeDetectionResult,
  PersonalizedRecommendation,
} from "../services/AgeDetectionService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UseAgeDetectionResult {
  // Estado de detección
  isDetecting: boolean;
  detectionResult: AgeDetectionResult | null;

  // Recomendaciones
  recommendations: PersonalizedRecommendation[];
  isLoadingRecommendations: boolean;

  // Funciones
  detectAge: () => Promise<void>;
  regenerateRecommendations: () => Promise<void>;
  markRecommendationAsImplemented: (id: string) => Promise<void>;

  // Utilidades
  isFirstTime: boolean;
  confidence: number;
  suggestedActions: PersonalizedRecommendation[];
}

export const useAgeDetection = (): UseAgeDetectionResult => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<AgeDetectionResult | null>(null);
  const [recommendations, setRecommendations] = useState<
    PersonalizedRecommendation[]
  >([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const ageDetectionService = AgeDetectionService.getInstance();

  // ✅ CARGAR DETECCIÓN PREVIA AL INICIALIZAR
  useEffect(() => {
    loadPreviousDetection();
  }, []);

  // ✅ CARGAR DETECCIÓN PREVIA
  const loadPreviousDetection = async () => {
    try {
      const previousDetection =
        await ageDetectionService.loadPreviousAgeDetection();

      if (previousDetection) {
        setDetectionResult(previousDetection);
        setIsFirstTime(false);

        // Cargar recomendaciones para el grupo de edad detectado
        await loadRecommendations(previousDetection.predictedAgeGroup);

        console.log(
          "🔄 Detección previa cargada:",
          previousDetection.predictedAgeGroup
        );
      } else {
        setIsFirstTime(true);
        console.log("🆕 Primera vez - necesaria detección de edad");
      }
    } catch (error) {
      console.error("Error cargando detección previa:", error);
      setIsFirstTime(true);
    }
  };

  // ✅ DETECTAR EDAD AUTOMÁTICAMENTE
  const detectAge = useCallback(async () => {
    try {
      setIsDetecting(true);
      console.log("🎯 Iniciando detección automática de edad...");

      const result = await ageDetectionService.detectAgeGroup();
      setDetectionResult(result);

      // Guardar el resultado
      await ageDetectionService.saveAgeDetection(result);

      // Actualizar perfil de usuario con la detección
      await updateUserProfile(result);

      // Cargar recomendaciones para el grupo detectado
      await loadRecommendations(result.predictedAgeGroup);

      setIsFirstTime(false);

      console.log("✅ Detección completada:", {
        ageGroup: result.predictedAgeGroup,
        confidence: result.confidence,
        reasoning: result.reasoning,
      });
    } catch (error) {
      console.error("❌ Error en detección de edad:", error);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  // ✅ CARGAR RECOMENDACIONES
  const loadRecommendations = async (
    ageGroup: "kids" | "teens" | "adults" | "seniors"
  ) => {
    try {
      setIsLoadingRecommendations(true);

      const newRecommendations =
        await ageDetectionService.generatePersonalizedRecommendations(ageGroup);

      // Filtrar recomendaciones ya implementadas
      const implementedIds = await getImplementedRecommendations();
      const filteredRecommendations = newRecommendations.filter(
        (rec) => !implementedIds.includes(rec.id)
      );

      setRecommendations(filteredRecommendations);

      console.log(
        `💡 ${filteredRecommendations.length} recomendaciones cargadas para ${ageGroup}`
      );
    } catch (error) {
      console.error("Error cargando recomendaciones:", error);
      setRecommendations([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // ✅ REGENERAR RECOMENDACIONES
  const regenerateRecommendations = useCallback(async () => {
    if (detectionResult) {
      await loadRecommendations(detectionResult.predictedAgeGroup);
    }
  }, [detectionResult]);

  // ✅ MARCAR RECOMENDACIÓN COMO IMPLEMENTADA
  const markRecommendationAsImplemented = useCallback(async (id: string) => {
    try {
      const implementedIds = await getImplementedRecommendations();
      const updatedIds = [...implementedIds, id];

      await AsyncStorage.setItem(
        "implementedRecommendations",
        JSON.stringify(updatedIds)
      );

      // Remover de la lista actual
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id));

      console.log("✅ Recomendación marcada como implementada:", id);
    } catch (error) {
      console.error("Error marcando recomendación:", error);
    }
  }, []);

  // ✅ ACTUALIZAR PERFIL DE USUARIO CON DETECCIÓN
  const updateUserProfile = async (result: AgeDetectionResult) => {
    try {
      const existingProfile = await AsyncStorage.getItem("userProfile");
      let profile;

      if (existingProfile) {
        profile = JSON.parse(existingProfile);
      } else {
        profile = {
          name: "Aventurero Matemático",
          preferences: {
            highContrast: false,
            largeText: false,
            soundEnabled: true,
            hapticsEnabled: true,
          },
        };
      }

      // Actualizar con la detección de edad
      profile.ageGroup = result.predictedAgeGroup;
      profile.ageDetectionConfidence = result.confidence;
      profile.ageDetectionTimestamp = Date.now();
      profile.behavioralIndicators = result.behavioralIndicators;

      // Aplicar configuraciones específicas por edad
      switch (result.predictedAgeGroup) {
        case "kids":
          profile.preferences.largeText = true;
          profile.preferences.soundEnabled = true;
          break;
        case "seniors":
          profile.preferences.highContrast = true;
          profile.preferences.largeText = true;
          break;
        case "teens":
          profile.preferences.hapticsEnabled = true;
          break;
        case "adults":
          // Configuración estándar
          break;
      }

      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));

      console.log("👤 Perfil actualizado con detección de edad");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    }
  };

  // ✅ OBTENER RECOMENDACIONES IMPLEMENTADAS
  const getImplementedRecommendations = async (): Promise<string[]> => {
    try {
      const implementedIds = await AsyncStorage.getItem(
        "implementedRecommendations"
      );
      return implementedIds ? JSON.parse(implementedIds) : [];
    } catch (error) {
      console.error("Error obteniendo recomendaciones implementadas:", error);
      return [];
    }
  };

  // ✅ CALCULAR VALORES DERIVADOS
  const confidence = detectionResult?.confidence || 0;
  const suggestedActions = recommendations
    .filter((rec) => rec.priority === "high")
    .slice(0, 3);

  return {
    // Estado
    isDetecting,
    detectionResult,
    recommendations,
    isLoadingRecommendations,

    // Funciones
    detectAge,
    regenerateRecommendations,
    markRecommendationAsImplemented,

    // Utilidades
    isFirstTime,
    confidence,
    suggestedActions,
  };
};

export default useAgeDetection;
