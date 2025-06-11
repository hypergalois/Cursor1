// Hook para manejar el flujo de onboarding
// Determina qué pantalla mostrar según el estado del usuario

import { useState, useEffect } from "react";
import { onboardingService } from "../services/OnboardingService";

export interface OnboardingState {
  isLoading: boolean;
  shouldShowOnboarding: boolean;
  initialRoute: string;
  userProfile: any;
}

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    isLoading: true,
    shouldShowOnboarding: true,
    initialRoute: "WelcomeScreen",
    userProfile: null,
  });

  const checkOnboardingStatus = async () => {
    try {
      // Verificar si existe un usuario
      const userProfile = await onboardingService.getUserProfile();

      if (!userProfile) {
        // No hay usuario - mostrar onboarding desde el inicio
        setState({
          isLoading: false,
          shouldShowOnboarding: true,
          initialRoute: "WelcomeScreen",
          userProfile: null,
        });
        return;
      }

      // Hay usuario - verificar si completó onboarding
      const isCompleted = await onboardingService.isOnboardingCompleted();

      if (isCompleted) {
        // Onboarding completado - ir directo a la app
        setState({
          isLoading: false,
          shouldShowOnboarding: false,
          initialRoute: "CleanHome",
          userProfile,
        });
      } else {
        // Onboarding incompleto - continuar desde donde se quedó
        const nextStep = await onboardingService.getNextOnboardingStep();
        const initialRoute = nextStep
          ? nextStep.component
          : "LearningGoalsScreen";

        setState({
          isLoading: false,
          shouldShowOnboarding: true,
          initialRoute,
          userProfile,
        });
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // En caso de error, mostrar onboarding
      setState({
        isLoading: false,
        shouldShowOnboarding: true,
        initialRoute: "WelcomeScreen",
        userProfile: null,
      });
    }
  };

  const resetOnboarding = async () => {
    try {
      await onboardingService.resetOnboarding();
      setState({
        isLoading: false,
        shouldShowOnboarding: true,
        initialRoute: "WelcomeScreen",
        userProfile: null,
      });
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  return {
    ...state,
    refreshOnboardingStatus: checkOnboardingStatus,
    resetOnboarding,
  };
};
