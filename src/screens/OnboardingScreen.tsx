import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  animations,
  getThemeForAge,
} from "../styles/theme";
import MinoMascot from "../components/MinoMascot";

interface OnboardingScreenProps {
  navigation: any;
}

interface UserProfile {
  name: string;
  ageGroup: "kids" | "teens" | "adults" | "seniors";
  minoName: string;
  preferences: {
    highContrast: boolean;
    largeText: boolean;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
  };
}

const { width, height } = Dimensions.get("window");

// 🎯 PASOS DEL ONBOARDING TIPO DUOLINGO
const onboardingSteps = [
  {
    id: "welcome",
    type: "intro",
    title: "¡Hola! 👋",
    subtitle: "Bienvenido a tu aventura matemática",
    description:
      "Soy Mino, tu compañero de aventuras. Juntos exploraremos el mundo de las matemáticas de forma divertida.",
    mascotMood: "happy" as const,
    background: colors.duolingo.blue,
  },
  {
    id: "age",
    type: "selection",
    title: "¿Cuál es tu grupo de edad?",
    subtitle: "Esto me ayuda a personalizar tu experiencia",
    description:
      "Cada grupo tiene su propia aventura especial diseñada para ti.",
    mascotMood: "neutral" as const,
    background: colors.duolingo.green,
  },
  {
    id: "name",
    type: "input",
    title: "¡Genial! ¿Cómo te llamas?",
    subtitle: "Me gusta conocer a mis amigos",
    description: "Puedes usar tu nombre real o uno inventado, ¡como prefieras!",
    mascotMood: "happy" as const,
    background: colors.duolingo.purple,
  },
  {
    id: "minoname",
    type: "input",
    title: "¿Cómo quieres llamarme?",
    subtitle: "Puedes darme el nombre que más te guste",
    description: "¡Me encanta tener un nombre especial para cada aventurero!",
    mascotMood: "happy" as const,
    background: colors.duolingo.orange,
  },
  {
    id: "tutorial",
    type: "interactive",
    title: "¡Probemos tu primera misión!",
    subtitle: "Vamos a resolver un problema juntos",
    description:
      "No te preocupes, es súper fácil. ¡Solo toca la respuesta correcta!",
    mascotMood: "neutral" as const,
    background: colors.duolingo.green,
  },
  {
    id: "preferences",
    type: "settings",
    title: "Configuremos tu experiencia",
    subtitle: "Para que sea perfecta para ti",
    description:
      "Puedes cambiar estas opciones cuando quieras en Configuración.",
    mascotMood: "neutral" as const,
    background: colors.duolingo.blue,
  },
  {
    id: "ready",
    type: "celebration",
    title: "¡Todo listo! 🎉",
    subtitle: "¡Tu aventura matemática comienza ahora!",
    description:
      "Prepárate para explorar mazmorras, ganar estrellas y convertirte en un maestro matemático.",
    mascotMood: "happy" as const,
    background: colors.duolingo.gold,
  },
];

const ageGroups = [
  {
    id: "kids" as const,
    title: "Niños",
    subtitle: "6-11 años",
    emoji: "🧒",
    description: "Aventuras coloridas y divertidas",
    color: colors.duolingo.pink,
    features: [
      "🎮 Juegos interactivos",
      "🌟 Recompensas divertidas",
      "🎈 Animaciones alegres",
    ],
    learningStyle: "Aprenden mejor con elementos visuales y juegos",
    sessionOptimal: "10-15 minutos",
  },
  {
    id: "teens" as const,
    title: "Adolescentes",
    subtitle: "12-17 años",
    emoji: "🧑",
    description: "Desafíos modernos y geniales",
    color: colors.duolingo.purple,
    features: ["🔥 Desafíos épicos", "🏆 Logros geniales", "⚡ Competencias"],
    learningStyle: "Les motivan los retos y la competencia",
    sessionOptimal: "20-25 minutos",
  },
  {
    id: "adults" as const,
    title: "Adultos",
    subtitle: "18-64 años",
    emoji: "👩‍💼",
    description: "Aprendizaje eficiente y práctico",
    color: colors.duolingo.blue,
    features: [
      "💼 Aplicaciones prácticas",
      "📊 Progreso claro",
      "⚡ Eficiencia",
    ],
    learningStyle: "Buscan relevancia práctica y eficiencia",
    sessionOptimal: "25-30 minutos",
  },
  {
    id: "seniors" as const,
    title: "Adultos mayores",
    subtitle: "65+ años",
    emoji: "👴",
    description: "Interfaz clara y cómoda",
    color: colors.duolingo.green,
    features: [
      "🌟 Instrucciones claras",
      "💭 Ritmo cómodo",
      "🎯 Experiencia respetada",
    ],
    learningStyle: "Valoran la claridad y el respeto por su experiencia",
    sessionOptimal: "15-20 minutos",
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    ageGroup: "adults",
    minoName: "Mino",
    preferences: {
      highContrast: false,
      largeText: false,
      soundEnabled: true,
      hapticsEnabled: true,
    },
  });
  const [tutorialAnswer, setTutorialAnswer] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentStepData = onboardingSteps[currentStep];
  const theme = getThemeForAge(userProfile.ageGroup);

  const animateTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animations.fast,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animations.normal,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      animateTransition();
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition();
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);

    // Aquí guardaríamos el perfil del usuario
    console.log("👤 Usuario completó onboarding:", userProfile);

    // Celebración final
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      navigation.navigate("Welcome", { userProfile });
    }, 1500);
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.mascotContainer}>
        <MinoMascot mood={currentStepData.mascotMood} size={160} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {currentStepData.title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {currentStepData.subtitle}
        </Text>
        <Text
          style={[styles.description, { color: theme.colors.text.secondary }]}
        >
          {currentStepData.description}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary.main },
        ]}
        onPress={handleNext}
      >
        <Text
          style={[styles.primaryButtonText, { color: theme.colors.text.white }]}
        >
          ¡Empecemos! 🚀
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAgeSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {currentStepData.title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary, marginBottom: spacing.xl },
        ]}
      >
        {currentStepData.subtitle}
      </Text>

      <ScrollView
        style={styles.ageOptionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {ageGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.ageOption,
              userProfile.ageGroup === group.id && [
                styles.selectedAgeOption,
                {
                  backgroundColor: group.color + "20",
                  borderColor: group.color,
                },
              ],
            ]}
            onPress={() =>
              setUserProfile({ ...userProfile, ageGroup: group.id })
            }
          >
            <Text style={styles.ageEmoji}>{group.emoji}</Text>
            <View style={styles.ageInfo}>
              <Text
                style={[styles.ageTitle, { color: theme.colors.text.primary }]}
              >
                {group.title}
              </Text>
              <Text
                style={[
                  styles.ageSubtitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {group.subtitle}
              </Text>
              <Text
                style={[
                  styles.ageDescription,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                {group.description}
              </Text>

              {/* ✅ NUEVO: Información detallada por edad */}
              <View style={styles.ageDetails}>
                <Text
                  style={[
                    styles.ageFeatures,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {group.features.join(" • ")}
                </Text>
                <Text
                  style={[
                    styles.ageLearningStyle,
                    { color: theme.colors.primary.main },
                  ]}
                >
                  💡 {group.learningStyle}
                </Text>
                <Text
                  style={[
                    styles.ageSessionOptimal,
                    { color: theme.colors.success.main },
                  ]}
                >
                  ⏱️ Sesiones ideales: {group.sessionOptimal}
                </Text>
              </View>
            </View>
            {userProfile.ageGroup === group.id && (
              <Text style={[styles.checkmark, { color: group.color }]}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text
            style={[
              styles.secondaryButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Atrás
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                ageGroups.find((g) => g.id === userProfile.ageGroup)?.color ||
                theme.colors.primary.main,
            },
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.text.white },
            ]}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNameInput = () => (
    <View style={styles.stepContainer}>
      <View style={styles.mascotContainer}>
        <MinoMascot mood={currentStepData.mascotMood} size={120} />
      </View>

      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {currentStepData.title}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        {currentStepData.subtitle}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: theme.colors.primary.main,
              color: theme.colors.text.primary,
              fontSize: theme.typography.body.fontSize,
            },
          ]}
          placeholder="Tu nombre aquí..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={userProfile.name}
          onChangeText={(text) =>
            setUserProfile({ ...userProfile, name: text })
          }
          autoFocus={true}
          maxLength={20}
        />
      </View>

      <Text
        style={[styles.description, { color: theme.colors.text.secondary }]}
      >
        {currentStepData.description}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text
            style={[
              styles.secondaryButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Atrás
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                userProfile.name.length >= 2
                  ? theme.colors.primary.main
                  : theme.colors.text.light,
            },
          ]}
          onPress={handleNext}
          disabled={userProfile.name.length < 2}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.text.white },
            ]}
          >
            Siguiente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMinoNameInput = () => (
    <View style={styles.stepContainer}>
      <View style={styles.mascotContainer}>
        <MinoMascot mood={currentStepData.mascotMood} size={120} />
      </View>

      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {currentStepData.title}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        {currentStepData.subtitle}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: theme.colors.primary.main,
              color: theme.colors.text.primary,
              fontSize: theme.typography.body.fontSize,
            },
          ]}
          placeholder="Mino"
          placeholderTextColor={theme.colors.text.tertiary}
          value={userProfile.minoName}
          onChangeText={(text) =>
            setUserProfile({ ...userProfile, minoName: text })
          }
          maxLength={15}
        />
      </View>

      <Text
        style={[styles.description, { color: theme.colors.text.secondary }]}
      >
        {currentStepData.description}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text
            style={[
              styles.secondaryButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Atrás
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: theme.colors.primary.main },
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.text.white },
            ]}
          >
            ¡Perfecto!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTutorial = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {currentStepData.title}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        {currentStepData.subtitle}
      </Text>

      <View style={styles.tutorialProblem}>
        <Text
          style={[styles.problemText, { color: theme.colors.text.primary }]}
        >
          ¿Cuánto es 3 + 2?
        </Text>

        <View style={styles.tutorialOptions}>
          {[4, 5, 6].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tutorialOption,
                tutorialAnswer === option && styles.selectedTutorialOption,
                tutorialAnswer === 5 &&
                  option === 5 &&
                  styles.correctTutorialOption,
                tutorialAnswer !== null &&
                  option !== 5 &&
                  tutorialAnswer === option &&
                  styles.incorrectTutorialOption,
                { borderColor: theme.colors.primary.main },
              ]}
              onPress={() => setTutorialAnswer(option)}
              disabled={tutorialAnswer !== null}
            >
              <Text
                style={[
                  styles.tutorialOptionText,
                  { color: theme.colors.text.primary },
                  tutorialAnswer === option && { fontWeight: "600" },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tutorialAnswer !== null && (
          <View style={styles.tutorialFeedback}>
            {tutorialAnswer === 5 ? (
              <>
                <Text
                  style={[
                    styles.feedbackText,
                    { color: theme.colors.success.main },
                  ]}
                >
                  ¡Excelente! 🎉
                </Text>
                <Text
                  style={[
                    styles.feedbackDescription,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  ¡Así se hace! Has ganado tu primera estrella ⭐
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.feedbackText,
                    { color: theme.colors.warning.main },
                  ]}
                >
                  ¡Casi! 😊
                </Text>
                <Text
                  style={[
                    styles.feedbackDescription,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  La respuesta correcta es 5. ¡Pero no te preocupes, estás
                  aprendiendo!
                </Text>
              </>
            )}
          </View>
        )}
      </View>

      <View style={styles.mascotContainer}>
        <MinoMascot
          mood={
            tutorialAnswer === 5
              ? "happy"
              : tutorialAnswer !== null
              ? "neutral"
              : "neutral"
          }
          size={100}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text
            style={[
              styles.secondaryButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Atrás
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                tutorialAnswer !== null
                  ? theme.colors.primary.main
                  : theme.colors.text.light,
            },
          ]}
          onPress={handleNext}
          disabled={tutorialAnswer === null}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.text.white },
            ]}
          >
            ¡Entendido!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPreferences = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {currentStepData.title}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        {currentStepData.subtitle}
      </Text>

      <View style={styles.preferencesContainer}>
        {[
          {
            key: "highContrast",
            title: "Alto contraste",
            description: "Colores más fuertes para mejor visibilidad",
            emoji: "🔆",
          },
          {
            key: "largeText",
            title: "Texto grande",
            description: "Tamaño de letra más grande",
            emoji: "🔤",
          },
          {
            key: "soundEnabled",
            title: "Sonidos",
            description: "Efectos de sonido y música",
            emoji: "🔊",
          },
          {
            key: "hapticsEnabled",
            title: "Vibración",
            description: "Feedback táctil al tocar",
            emoji: "📳",
          },
        ].map((pref) => (
          <TouchableOpacity
            key={pref.key}
            style={[
              styles.preferenceOption,
              { borderColor: theme.colors.primary.light },
            ]}
            onPress={() =>
              setUserProfile({
                ...userProfile,
                preferences: {
                  ...userProfile.preferences,
                  [pref.key as keyof typeof userProfile.preferences]:
                    !userProfile.preferences[
                      pref.key as keyof typeof userProfile.preferences
                    ],
                },
              })
            }
          >
            <Text style={styles.preferenceEmoji}>{pref.emoji}</Text>
            <View style={styles.preferenceInfo}>
              <Text
                style={[
                  styles.preferenceTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {pref.title}
              </Text>
              <Text
                style={[
                  styles.preferenceDescription,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {pref.description}
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: userProfile.preferences[
                    pref.key as keyof typeof userProfile.preferences
                  ]
                    ? theme.colors.primary.main
                    : theme.colors.text.light,
                },
              ]}
            >
              <Text
                style={[styles.toggleText, { color: theme.colors.text.white }]}
              >
                {userProfile.preferences[
                  pref.key as keyof typeof userProfile.preferences
                ]
                  ? "ON"
                  : "OFF"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text
            style={[
              styles.secondaryButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Atrás
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: theme.colors.primary.main },
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.text.white },
            ]}
          >
            ¡Listo!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCelebration = () => (
    <Animated.View
      style={[styles.stepContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.celebrationContainer}>
        <Text style={[styles.celebrationEmoji]}>🎉</Text>
        <MinoMascot mood="happy" size={140} />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          ¡Hola {userProfile.name}!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {userProfile.minoName} está emocionado de acompañarte
        </Text>
        <Text
          style={[styles.description, { color: theme.colors.text.secondary }]}
        >
          {currentStepData.description}
        </Text>
      </View>

      {!isCompleting ? (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: currentStepData.background },
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.text.white },
            ]}
          >
            ¡Comenzar aventura! 🚀
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.loadingButton,
            { backgroundColor: theme.colors.text.light },
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.text.white },
            ]}
          >
            Preparando tu aventura...
          </Text>
        </View>
      )}
    </Animated.View>
  );

  const renderCurrentStep = () => {
    switch (currentStepData.type) {
      case "intro":
        return renderWelcomeStep();
      case "selection":
        return renderAgeSelection();
      case "input":
        return currentStepData.id === "name"
          ? renderNameInput()
          : renderMinoNameInput();
      case "interactive":
        return renderTutorial();
      case "settings":
        return renderPreferences();
      case "celebration":
        return renderCelebration();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentStepData.background + "10" },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={currentStepData.background + "10"}
      />

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
                backgroundColor: currentStepData.background,
              },
            ]}
          />
        </View>
        <Text
          style={[styles.progressText, { color: theme.colors.text.secondary }]}
        >
          {currentStep + 1} de {onboardingSteps.length}
        </Text>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {renderCurrentStep()}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.text.light + "30",
    borderRadius: 2,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    textAlign: "center",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  stepContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: spacing.xl,
  },
  mascotContainer: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...typography.h1,
    textAlign: "center",
    marginBottom: spacing.md,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.h4,
    textAlign: "center",
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  description: {
    ...typography.body,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  // Age selection
  ageOptionsContainer: {
    flex: 1,
    width: "100%",
    marginBottom: spacing.lg,
  },
  ageOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.text.light + "30",
    ...shadows.small,
  },
  selectedAgeOption: {
    borderWidth: 2,
    ...shadows.medium,
  },
  ageEmoji: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  ageInfo: {
    flex: 1,
  },
  ageTitle: {
    ...typography.h3,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  ageSubtitle: {
    ...typography.body,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  ageDescription: {
    ...typography.caption,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // Input
  inputContainer: {
    width: "100%",
    marginVertical: spacing.xl,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    textAlign: "center",
    ...typography.h3,
    fontWeight: "500",
    backgroundColor: colors.background.paper,
    ...shadows.small,
  },

  // Tutorial
  tutorialProblem: {
    backgroundColor: colors.background.paper,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    width: "100%",
    alignItems: "center",
    marginVertical: spacing.lg,
    ...shadows.medium,
  },
  problemText: {
    ...typography.h2,
    fontWeight: "600",
    marginBottom: spacing.xl,
  },
  tutorialOptions: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  tutorialOption: {
    backgroundColor: colors.background.paper,
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    paddingHorizontal: spacing.xl,
    minWidth: 60,
    alignItems: "center",
    ...shadows.small,
  },
  selectedTutorialOption: {
    borderWidth: 3,
    ...shadows.medium,
  },
  correctTutorialOption: {
    backgroundColor: colors.success.light,
    borderColor: colors.success.main,
  },
  incorrectTutorialOption: {
    backgroundColor: colors.warning.light,
    borderColor: colors.warning.main,
  },
  tutorialOptionText: {
    ...typography.h2,
    fontWeight: "600",
  },
  tutorialFeedback: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  feedbackText: {
    ...typography.h3,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  feedbackDescription: {
    ...typography.body,
    textAlign: "center",
  },

  // Preferences
  preferencesContainer: {
    width: "100%",
    flex: 1,
    marginVertical: spacing.lg,
  },
  preferenceOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  preferenceEmoji: {
    fontSize: 24,
    marginRight: spacing.lg,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceTitle: {
    ...typography.h4,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  preferenceDescription: {
    ...typography.caption,
  },
  toggle: {
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 50,
    alignItems: "center",
  },
  toggleText: {
    ...typography.caption,
    fontWeight: "700",
  },

  // Celebration
  celebrationContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },

  // Buttons
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    ...shadows.medium,
  },
  primaryButtonText: {
    ...typography.button,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.text.light,
  },
  secondaryButtonText: {
    ...typography.button,
    fontWeight: "600",
  },
  loadingButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    opacity: 0.7,
  },
  // ✅ NUEVOS: Estilos para información detallada por edad
  ageDetails: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  ageFeatures: {
    ...typography.caption,
    fontSize: 11,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  ageLearningStyle: {
    ...typography.caption,
    fontSize: 11,
    marginBottom: spacing.xs,
    textAlign: "center",
    fontStyle: "italic",
  },
  ageSessionOptimal: {
    ...typography.caption,
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default OnboardingScreen;
