# 🏛️ Minotauro - Juego Educativo de Matemáticas

Una aplicación móvil React Native que combina aprendizaje matemático con aventuras de exploración de dungeons, potenciada por sistemas de gamificación avanzados y AI personalizada.

## 🎯 **Características Principales**

### 🎮 **Gamificación Completa**

- **Sistema de Estrellas**: 1-3 estrellas por problema basado en velocidad, precisión y dificultad
- **Progresión de Niveles**: 10 niveles únicos con títulos temáticos ("Aventurero Novato" → "Dios de las Matemáticas")
- **Sistema de Logros**: 9 categorías de achievements con múltiples niveles de dificultad
- **XP y Recompensas**: Sistema de puntos y recompensas diarias

### 🧠 **Inteligencia Artificial y Personalización**

- **Performance Analytics**: Análisis profundo de patrones de aprendizaje
- **Adaptive Problem Generator**: Generación dinámica de problemas personalizados
- **Learning Insights**: AI que identifica fortalezas, debilidades y recomienda mejoras
- **Cognitive Diagnostics**: Análisis del perfil cognitivo del usuario

### 🗺️ **Exploración de Dungeons**

- **Mapa Interactivo**: Explora diferentes mazos con temáticas matemáticas
- **Efectos Visuales**: Partículas, animaciones y efectos especiales
- **Mascota Mino**: Compañero virtual que guía al usuario
- **Progresión Narrativa**: Historia que se desarrolla mientras aprendes

### 📊 **Análisis Avanzado**

- **Métricas Detalladas**: Tiempo de respuesta, precisión, patrones de error
- **Tendencias de Progreso**: Seguimiento de mejoras a lo largo del tiempo
- **Insights Personalizados**: Recomendaciones basadas en comportamiento
- **Detección de Burnout**: Sistema preventivo de fatiga de aprendizaje

## 🏗️ **Arquitectura del Proyecto**

```
src/
├── components/           # Componentes reutilizables
│   ├── StarSystem.tsx          # Sistema de calificación por estrellas
│   ├── LevelProgression.tsx    # Progresión de niveles y XP
│   ├── AchievementSystem.tsx   # Sistema de logros
│   ├── UserProfileExpanded.tsx # Perfil completo del usuario
│   ├── LearningInsights.tsx    # Insights de AI
│   ├── DungeonMap.tsx         # Mapa de exploración
│   ├── ProblemEffects.tsx     # Efectos visuales
│   ├── MinoMascot.tsx         # Mascota interactiva
│   └── ...                    # Otros componentes UI
│
├── services/            # Lógica de negocio
│   ├── PerformanceAnalytics.ts    # Análisis de rendimiento
│   ├── AdaptiveProblemGenerator.ts # Generación adaptativa
│   ├── ProgressTrackingService.ts # Seguimiento básico
│   ├── UserProgress.ts            # Gestión de progreso
│   └── StorageService.ts          # Persistencia de datos
│
├── screens/             # Pantallas principales
│   ├── ResultScreen.tsx          # Pantalla de resultados
│   ├── ProblemScreen.tsx         # Pantalla de problemas
│   ├── DungeonScreen.tsx         # Pantalla de exploración
│   ├── ProfileScreen.tsx         # Pantalla de perfil
│   └── ...                       # Otras pantallas
│
├── utils/               # Utilidades
│   ├── AdaptiveDifficulty.ts     # Sistema de dificultad adaptativa
│   └── ...                       # Otras utilidades
│
├── styles/              # Temas y estilos
│   └── theme.ts                  # Sistema de diseño unificado
│
├── types/               # Definiciones TypeScript
├── data/                # Datos mock y configuración
└── assets/              # Recursos gráficos
```

## 🚀 **Instalación y Configuración**

### Prerrequisitos

```bash
# Node.js 18+
node --version

# Expo CLI
npm install -g expo-cli

# React Native CLI (opcional)
npm install -g @react-native-community/cli
```

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd minotauro

# Instalar dependencias
npm install

# Iniciar el proyecto
expo start
```

### Dependencias Principales

```json
{
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17",
  "expo": "~50.0.0",
  "react-native": "^0.73.6"
}
```

## 📱 **Uso de la Aplicación**

### 🎮 **Flujo de Juego**

1. **Bienvenida**: Tutorial interactivo para nuevos usuarios
2. **Exploración**: Navega por el mapa del dungeon
3. **Problemas**: Resuelve problemas matemáticos adaptativos
4. **Resultados**: Recibe feedback detallado y estrellas
5. **Progreso**: Revisa insights y progresión

### 🏆 **Sistema de Recompensas**

- **Estrellas**: 1-3 por problema completado
- **XP**: Puntos de experiencia para subir de nivel
- **Logros**: Desbloquea achievements únicos
- **Insights**: Recibe análisis personalizado

### 📊 **Perfil de Usuario**

- **General**: Estadísticas principales y progreso
- **Insights**: Análisis de AI y recomendaciones
- **Progreso**: Tendencias y métricas detalladas
- **Logros**: Galería de achievements desbloqueados

## 🧠 **Sistema de IA**

### Performance Analytics

```typescript
interface SessionMetrics {
  sessionId: string;
  problemsSolved: number;
  accuracyRate: number;
  averageResponseTime: number;
  learningVelocity: number;
  focusScore: number;
  consistencyScore: number;
  mistakePatterns: MistakePattern[];
}
```

### Adaptive Problem Generation

```typescript
interface AdaptiveProblem {
  id: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  adaptiveFactors: {
    targetWeakness: boolean;
    reinforceStrength: boolean;
    optimalTiming: boolean;
    personalizedStyle: boolean;
  };
  metadata: {
    conceptsInvolved: string[];
    cognitiveLoad: number;
  };
}
```

### Learning Insights

- **Cognitive**: Análisis de velocidad de procesamiento y memoria
- **Behavioral**: Patrones de estudio y hábitos
- **Emotional**: Estado motivacional y riesgo de burnout
- **Strategic**: Metacognición y estrategias de aprendizaje

## 🎨 **Sistema de Diseño**

### Paleta de Colores

```typescript
colors: {
  primary: {
    main: '#6366F1',    // Índigo principal
    light: '#A5B4FC',   // Índigo claro
    dark: '#4338CA'     // Índigo oscuro
  },
  success: '#10B981',   // Verde éxito
  error: '#EF4444',     // Rojo error
  accent: '#F59E0B',    // Ámbar acento
  background: {
    default: '#F8FAFC', // Fondo principal
    paper: '#FFFFFF'    // Fondo de tarjetas
  }
}
```

### Tipografía

- **h1**: 32px, peso 700 - Títulos principales
- **h2**: 24px, peso 600 - Títulos secundarios
- **h3**: 20px, peso 600 - Subtítulos
- **body**: 16px, peso 400 - Texto principal
- **caption**: 14px, peso 400 - Texto secundario

## 🔧 **Configuración Avanzada**

### Personalización del Sistema Adaptativo

```typescript
// En AdaptiveDifficulty.ts
const difficultyModifiers = {
  rangeMultiplier: 1.5, // Ajustar rango de números
  complexityLevel: 3, // Nivel de complejidad (0-4)
  hintAvailability: true, // Mostrar pistas
  timeBonus: false, // Bonus por velocidad
};
```

### Configuración de Analytics

```typescript
// En PerformanceAnalytics.ts
const sessionConfig = {
  minProblemsForInsights: 5,
  confidenceThreshold: 0.7,
  burnoutRiskThreshold: 0.6,
  engagementMinimum: 0.4,
};
```

## 📈 **Métricas y KPIs**

### Métricas de Usuario

- **Retention Rate**: Usuarios activos por día/semana/mes
- **Engagement**: Tiempo promedio de sesión
- **Learning Velocity**: Velocidad de mejora
- **Accuracy Trends**: Tendencias de precisión

### Métricas de Contenido

- **Problem Completion Rate**: Tasa de finalización
- **Difficulty Distribution**: Distribución de dificultades
- **Category Performance**: Rendimiento por categoría matemática
- **Adaptive Effectiveness**: Efectividad del sistema adaptativo

## 🛠️ **Desarrollo y Contribución**

### Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm run web        # Ejecutar en navegador
```

### Estructura de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de estilo/formato
refactor: refactorización de código
test: añadir/actualizar tests
```

## 🔒 **Privacidad y Seguridad**

- **Almacenamiento Local**: Todos los datos se guardan localmente
- **Sin Tracking**: No se recopilan datos personales
- **Offline First**: Funciona completamente sin conexión
- **Encryption**: Datos sensibles encriptados en AsyncStorage

## 🚀 **Roadmap Futuro**

### Versión 1.1

- [ ] Modo multijugador local
- [ ] Más categorías matemáticas (álgebra, geometría)
- [ ] Sistema de clanes/grupos
- [ ] Exportación de reportes de progreso

### Versión 1.2

- [ ] Integración con Google Classroom
- [ ] Modo tutor para padres/maestros
- [ ] Challenges semanales
- [ ] Sistema de mentorías peer-to-peer

### Versión 2.0

- [ ] Realidad Aumentada para visualización matemática
- [ ] AI conversacional para tutorías
- [ ] Integración con curricula educativas oficiales
- [ ] Analytics predictivos avanzados

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 💡 **Inspiración y Reconocimientos**

- **Khan Academy**: Inspiración para el sistema adaptativo
- **Duolingo**: Gamificación y progresión
- **Minecraft Education**: Exploración y aventura educativa
- **Cognitive Load Theory**: Base teórica para el diseño de aprendizaje

## 📞 **Contacto**

- **Desarrollador Principal**: [Tu Nombre]
- **Email**: [tu.email@ejemplo.com]
- **GitHub**: [github.com/tu-usuario]

---

## 🎉 **¡Gracias por usar Minotauro!**

Transformamos el aprendizaje matemático en una aventura épica. Cada problema resuelto es un paso más hacia el dominio de las matemáticas. ¡Que comience la aventura! 🏛️⚔️📚
