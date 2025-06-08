# Minotauro - Guía de Estilo

## Paleta de Colores

### Colores Primarios

- Principal: `#4A90E2` (Azul)
- Claro: `#6BA5E8`
- Oscuro: `#2C5AA0`

### Colores Secundarios

- Principal: `#FF6B6B` (Coral)
- Claro: `#FF8E8E`
- Oscuro: `#CC5555`

### Fondos

- Primario: `#F5F5F5` (Gris claro)
- Secundario: `#FFFFFF` (Blanco)
- Oscuro: `#2C3E50` (Azul oscuro)

### Texto

- Primario: `#333333` (Gris oscuro)
- Secundario: `#666666` (Gris medio)
- Claro: `#FFFFFF` (Blanco)

### Estados

- Éxito: `#4CAF50` (Verde)
- Error: `#F44336` (Rojo)
- Advertencia: `#FFC107` (Amarillo)
- Info: `#2196F3` (Azul)

### Colores del Juego

- Puerta: `#8B4513` (Marrón)
- Puerta Clara: `#A0522D` (Marrón claro)
- Laberinto: `#34495E` (Azul grisáceo)
- Camino: `#95A5A6` (Gris)

## Espaciado

Usar los siguientes valores para mantener consistencia:

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

## Tipografía

### Familias de Fuente

- Regular: System
- Bold: System

### Tamaños

- xs: 12px
- sm: 14px
- md: 16px
- lg: 20px
- xl: 24px
- xxl: 32px

## Bordes Redondeados

- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- round: 9999px (completamente redondo)

## Sombras

### Pequeña

```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 1,
}
```

### Mediana

```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}
```

### Grande

```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.30,
  shadowRadius: 4.65,
  elevation: 8,
}
```

## Animaciones

### Duración

- Rápida: 200ms
- Normal: 300ms
- Lenta: 500ms

### Easing

- ease-in-out
- ease-out
- ease-in

## Uso de Componentes

### Botones

- Usar color primario para acciones principales
- Usar color secundario para acciones secundarias
- Mantener padding consistente (md)
- Usar bordes redondeados (md)

### Tarjetas

- Fondo blanco
- Sombra mediana
- Bordes redondeados (lg)
- Padding interno (lg)

### Texto

- Títulos: xl o xxl
- Subtítulos: lg
- Cuerpo: md
- Notas: sm

### Espaciado entre Elementos

- Elementos relacionados: sm
- Secciones: lg
- Grupos grandes: xl

## Assets Requeridos

### Mascota Mino

- neutral.png
- happy.png
- angry.png

### Fondos

- dungeon-bg.png (Fondo principal de mazmorra)
- maze-bg.png (Fondo de laberinto)

### Iconos

- star.png (Estrella de logro)
- door-left.png (Puerta izquierda)
- door-right.png (Puerta derecha)
- trophy.png (Trofeo)
- lock.png (Candado)
- key.png (Llave)

## Notas de Diseño

1. Mantener consistencia en el uso de colores
2. Usar sombras para dar profundidad
3. Mantener espaciado consistente
4. Seguir la jerarquía tipográfica
5. Usar animaciones sutiles
6. Mantener la accesibilidad en mente
