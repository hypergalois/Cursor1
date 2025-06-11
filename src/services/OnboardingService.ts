// Servicio de Onboarding completo para Minotauro
// Maneja registro, datos de usuario, preferencias, todo en local storage

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  // Datos básicos
  username: string;
  name: string;
  email: string;
  password: string; // En un caso real esto estaría hasheado

  // Configuración de aprendizaje
  learningGoal: "career" | "hobby" | "academic" | "";
  mathInterests: string[]; // Tipos de problemas matemáticos
  accessibility: {
    textSize: "small" | "medium" | "large";
    colorMode: "default" | "high-contrast";
    reduceMotion: boolean;
    screenReader: boolean;
    hapticFeedback: boolean;
  };

  // Perfil
  profilePicture?: string;
  interests: string[]; // Intereses generales adaptados para matemáticas

  // Preferencias
  studyReminders: boolean;
  weeklyProgress: boolean;

  // Estado del onboarding
  onboardingCompleted: boolean;
  lastLoginDate: string;
  createdDate: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  component: string;
  completed: boolean;
}

class OnboardingService {
  private readonly USER_PROFILE_KEY = "minotauro_user_profile";
  private readonly ONBOARDING_STATE_KEY = "minotauro_onboarding_state";

  // Pasos del onboarding adaptados para Minotauro
  private readonly ONBOARDING_STEPS: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Bienvenida",
      component: "WelcomeScreen",
      completed: false,
    },
    {
      id: "register",
      title: "Registro",
      component: "RegisterScreen",
      completed: false,
    },
    {
      id: "goals",
      title: "Objetivos",
      component: "LearningGoalsScreen",
      completed: false,
    },
    {
      id: "math_interests",
      title: "Matemáticas",
      component: "MathInterestsScreen",
      completed: false,
    },
    {
      id: "accessibility",
      title: "Accesibilidad",
      component: "AccessibilityScreen",
      completed: false,
    },
    {
      id: "interests",
      title: "Intereses",
      component: "InterestsScreen",
      completed: false,
    },
    {
      id: "profile_picture",
      title: "Foto",
      component: "ProfilePictureScreen",
      completed: false,
    },
  ];

  // Obtener perfil del usuario
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(this.USER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading user profile:", error);
      return null;
    }
  }

  // Guardar perfil del usuario
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.USER_PROFILE_KEY,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  }

  // Actualizar datos parciales del perfil
  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const currentProfile = await this.getUserProfile();
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...updates };
        await this.saveUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  }

  // Verificar si el usuario ya completó el onboarding
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const profile = await this.getUserProfile();
      return profile?.onboardingCompleted || false;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  }

  // Marcar onboarding como completado
  async completeOnboarding(): Promise<void> {
    await this.updateUserProfile({
      onboardingCompleted: true,
      lastLoginDate: new Date().toISOString(),
    });
  }

  // Mock: Registrar nuevo usuario
  async registerUser(userData: {
    username: string;
    name: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar si ya existe un usuario
      const existingProfile = await this.getUserProfile();
      if (existingProfile) {
        return { success: false, message: "Ya existe un usuario registrado" };
      }

      // Crear perfil inicial
      const newProfile: UserProfile = {
        ...userData,
        learningGoal: "",
        mathInterests: [],
        accessibility: {
          textSize: "medium",
          colorMode: "default",
          reduceMotion: false,
          screenReader: false,
          hapticFeedback: true,
        },
        interests: [],
        studyReminders: false,
        weeklyProgress: false,
        onboardingCompleted: false,
        lastLoginDate: new Date().toISOString(),
        createdDate: new Date().toISOString(),
      };

      await this.saveUserProfile(newProfile);
      return { success: true, message: "Usuario registrado exitosamente" };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, message: "Error al registrar usuario" };
    }
  }

  // Mock: Login de usuario
  async loginUser(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const profile = await this.getUserProfile();

      if (!profile) {
        return { success: false, message: "No hay usuarios registrados" };
      }

      if (profile.email === email && profile.password === password) {
        await this.updateUserProfile({
          lastLoginDate: new Date().toISOString(),
        });
        return { success: true, message: "Login exitoso" };
      } else {
        return { success: false, message: "Email o contraseña incorrectos" };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Error en el login" };
    }
  }

  // Obtener siguiente paso del onboarding
  async getNextOnboardingStep(): Promise<OnboardingStep | null> {
    try {
      const stepsData = await AsyncStorage.getItem(this.ONBOARDING_STATE_KEY);
      const steps = stepsData ? JSON.parse(stepsData) : this.ONBOARDING_STEPS;

      return steps.find((step: OnboardingStep) => !step.completed) || null;
    } catch (error) {
      console.error("Error getting next onboarding step:", error);
      return this.ONBOARDING_STEPS[0];
    }
  }

  // Marcar paso como completado
  async completeOnboardingStep(stepId: string): Promise<void> {
    try {
      const stepsData = await AsyncStorage.getItem(this.ONBOARDING_STATE_KEY);
      const steps = stepsData ? JSON.parse(stepsData) : this.ONBOARDING_STEPS;

      const updatedSteps = steps.map((step: OnboardingStep) =>
        step.id === stepId ? { ...step, completed: true } : step
      );

      await AsyncStorage.setItem(
        this.ONBOARDING_STATE_KEY,
        JSON.stringify(updatedSteps)
      );
    } catch (error) {
      console.error("Error completing onboarding step:", error);
    }
  }

  // Resetear onboarding (para testing)
  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.USER_PROFILE_KEY);
      await AsyncStorage.removeItem(this.ONBOARDING_STATE_KEY);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  }

  // Obtener datos específicos para Minotauro
  getMathInterestsOptions() {
    return [
      {
        id: "addition",
        name: "Suma",
        emoji: "➕",
        description: "Operaciones de suma básicas y avanzadas",
      },
      {
        id: "subtraction",
        name: "Resta",
        emoji: "➖",
        description: "Operaciones de resta y números negativos",
      },
      {
        id: "multiplication",
        name: "Multiplicación",
        emoji: "✖️",
        description: "Tablas y multiplicaciones complejas",
      },
      {
        id: "division",
        name: "División",
        emoji: "➗",
        description: "División entera y con decimales",
      },
      {
        id: "fractions",
        name: "Fracciones",
        emoji: "¼",
        description: "Operaciones con fracciones",
      },
      {
        id: "decimals",
        name: "Decimales",
        emoji: "0.5",
        description: "Números decimales y porcentajes",
      },
      {
        id: "algebra",
        name: "Álgebra",
        emoji: "🔤",
        description: "Ecuaciones y variables",
      },
      {
        id: "geometry",
        name: "Geometría",
        emoji: "📐",
        description: "Formas, área y perímetro",
      },
    ];
  }

  getMathRelatedInterests() {
    return [
      "📊 Estadísticas",
      "📈 Gráficas",
      "🔢 Números",
      "🧮 Cálculos",
      "📐 Geometría",
      "📏 Medidas",
      "⏰ Tiempo",
      "💰 Dinero",
      "🎯 Lógica",
      "🧩 Puzzles",
      "🎲 Probabilidad",
      "📊 Datos",
      "🔬 Ciencias",
      "🚀 Física",
      "💻 Programación",
      "🎮 Juegos de Lógica",
      "🏗️ Ingeniería",
      "🎨 Arte Matemático",
      "🎵 Patrones Musicales",
      "⚽ Estadísticas Deportivas",
      "🍕 Fracciones en Cocina",
      "🏪 Compras y Descuentos",
      "📱 Tecnología",
      "🌍 Geografía",
    ];
  }

  getLearningGoalsForMath() {
    return [
      {
        id: "academic",
        name: "Éxito Académico",
        icon: "school",
        description: "Mejorar mis calificaciones en matemáticas",
        features: [
          { icon: "book", text: "Currículum estructurado por grados" },
          { icon: "time", text: "Herramientas de planificación de estudio" },
          { icon: "stats-chart", text: "Seguimiento detallado del progreso" },
        ],
      },
      {
        id: "hobby",
        name: "Interés Personal",
        icon: "heart",
        description: "Aprender matemáticas por diversión y curiosidad",
        features: [
          { icon: "star", text: "Aprendizaje basado en proyectos" },
          { icon: "game-controller", text: "Ejercicios divertidos y juegos" },
          { icon: "people", text: "Comunidad de aprendizaje" },
        ],
      },
      {
        id: "career",
        name: "Desarrollo Profesional",
        icon: "briefcase",
        description: "Fortalecer habilidades matemáticas para el trabajo",
        features: [
          { icon: "calculator", text: "Matemáticas aplicadas al trabajo" },
          { icon: "trending-up", text: "Análisis de datos y estadísticas" },
          { icon: "trophy", text: "Certificaciones profesionales" },
        ],
      },
    ];
  }
}

export const onboardingService = new OnboardingService();
