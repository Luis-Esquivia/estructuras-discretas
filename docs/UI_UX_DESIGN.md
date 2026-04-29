# Diseño UI/UX

## Filosofía de Diseño

La interfaz debe ser **minimalista pero poderosa**. Cada elemento tiene un propósito. No hay decoraciones innecesarias. La complejidad de la lógica matemática se presenta de forma digestible.

**Principios:**
1. **Simplicidad**: Tareas comunes en 1-2 clicks
2. **Claridad Visual**: Diferenciación clara entre elementos
3. **Retroalimentación Inmediata**: Todo feedback en <500ms
4. **Accesibilidad**: Navegación completa por teclado

## Paleta de Colores

### Colores Principales

| Propósito | Color | Hex | Uso |
|-----------|-------|-----|-----|
| Primario | Azul Profundo | `#2563EB` | Botones principales, enlaces |
| Secundario | Gris Pizarra | `#475569` | Texto secundario |
| Acento | Verde Intelecto | `#059669` | Éxito, correctas |
| Error | Rojo Claro | `#DC2626` | Errores, incorrectas |
| Fondo | Blanco Puro | `#FFFFFF` | Fondo principal |
| Fondo 2 | Gris Calma | `#F8FAFC` | Paneles, cards |

### Colores Semánticos para Módulos

| Módulo | Color | Hex |
|--------|-------|-----|
| Lógica | Púrpura | `#7C3AED` |
| Conjuntos | Naranja | `#EA580C` |
| Grafos | Cian | `#0891B2` |
| IA | Rosa | `#DB2777` |

### Sistema de Estados

| Estado | Color | Indicación |
|--------|-------|------------|
| Default | `#E2E8F0` | Gris claro |
| Hover | `#CBD5E1` | Gris medio |
| Active | `#2563EB` | Azul primario |
| Disabled | `#F1F5F9` | Gris muy claro |
| Correcto | `#059669` | Verde |
| Incorrecto | `#DC2626` | Rojo |

### Tipografía

```css
:root {
  /* Font Family */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

## Pantallas

### 1. Pantalla de Inicio (Home)

**Propósito:** Punto de entrada y navegación principal.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Logo                                          [?] [⚙] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    ESTRUCTURAS                           │
│                   DISCRETAS 🧮                           │
│                                                         │
│        Aprende lógica, conjuntos y grafos              │
│              de forma interactiva                      │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   LÓGICA    │ │  CONJUNTOS  │ │    GRAFOS   │       │
│  │   proposic. │ │    theory   │ │   grafos y  │       │
│  │             │ │             │ │   algoritmos│       │
│  │   ▶ Empezar │ │   ▶ Empezar │ │   ▶ Empezar │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elementos:**
- Header minimalista con logo
- Hero con nombre de la app y tagline
- 3 cards para cada módulo (colores distintivos)
- Footer con créditos

### 2. Pantalla de Lógica

**Propósito:** Trabajar con proposiciones y tablas de verdad.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Lógica                             [Ayuda] [IA 🤖]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  p ∧ (q ∨ r)                    [Limpiar] [Calcular]│ │
│  │  [¬] [∧] [∨] [→] [↔] [( )]                          │ │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────┐  ┌───────────────────────┐   │
│  │    TABLA DE VERDAD   │  │     RESULTADO          │   │
│  │  ┌───┬───┬───┬─────┐│  │                       │   │
│  │  │ p │ q │ r │ expr ││  │  Tautología: NO       │   │
│  │  ├───┼───┼───┼─────┤│  │  Contradicción: NO    │   │
│  │  │ V │ V │ V │  V   ││  │  Contingencia: SÍ     │   │
│  │  │ V │ V │ F │  F   ││  │                       │   │
│  │  │ V │ F │ V │  V   ││  │  [Explicar con IA]    │   │
│  │  │...│...│...│ ... ││  │                       │   │
│  │  └───┴───┴───┴─────┘│  └───────────────────────┘   │
│  └──────────────────────┘                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elementos:**
- Input grande con botones de operadores
- Tabla de verdad (scroll si muchas variables)
- Panel lateral con clasificación
- Botón de IA para explicaciones

### 3. Pantalla de Conjuntos

**Propósito:** Crear y operar con conjuntos.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Conjuntos                          [Ayuda] [IA 🤖] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────────────────────────┐   │
│  │  CONJUNTOS  │  │         OPERACIONES             │   │
│  │             │  │                                 │   │
│  │ A = {1,2,3} │  │  A [∪] B                        │   │
│  │ [Editar]    │  │  A [∩] B  [→]                   │   │
│  │             │  │  A [−] B                        │   │
│  │ B = {3,4,5} │  │  A [']  B                       │   │
│  │ [Editar]    │  │                                 │   │
│  │             │  │  [Calcular]                     │   │
│  │ [+ Crear]   │  │                                 │   │
│  └─────────────┘  └─────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              DIAGRAMA DE VENN                   │   │
│  │                                                 │   │
│  │           ┌───────────────┐                    │   │
│  │          │  A  │     B    │                    │   │
│  │          │  {1,2} {4,5}   │                    │   │
│  │          │  {3}←intersec │                    │   │
│  │           └───────────────┘                    │   │
│  │                                                 │   │
│  │  Resultado: A ∪ B = {1,2,3,4,5}                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elementos:**
- Panel izquierdo: lista de conjuntos
- Panel central: selector de operación
- Panel inferior: diagrama de Venn animado
- Visualización de resultado

### 4. Pantalla de Grafos

**Propósito:** Crear y visualizar grafos, ejecutar algoritmos.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Grafos                                   [Ayuda]     │
├───────────────────────────────────┬─────────────────────┤
│                                   │                     │
│         CANVAS DE GRAFOS          │   HERRAMIENTAS      │
│                                   │                     │
│           ● A                     │   [Agregar Nodo]    │
│          ↗ ↓                      │   [Agregar Arista]  │
│         ● B ──── ● C              │   [Dirigido: ON]    │
│                                   │                     │
│                                   │   ─────────────     │
│                                   │   ALGORITMOS        │
│                                   │                     │
│                                   │   [BFS] [DFS]       │
│                                   │   Inicio: [A ▼]     │
│                                   │   [Ejecutar]       │
│                                   │                     │
│                                   │   ─────────────     │
│                                   │   VISITADOS:        │
│                                   │   1. A              │
│                                   │   2. B              │
│                                   │   3. C              │
│                                   │                     │
├───────────────────────────────────┴─────────────────────┤
│  Lista de Adyacencia: A→[B,C] B→[C] C→[]                 │
└─────────────────────────────────────────────────────────┘
```

**Elementos:**
- Canvas grande para dibujar grafo
- Panel derecho: herramientas y algoritmos
- Barra inferior: lista de adyacencia
- Drag & drop para nodos

## Componentes Reutilizables

### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}
```

### Input

```typescript
interface InputProps {
  type: 'text' | 'number';
  placeholder?: string;
  error?: string;
  prefix?: string;  // Para operador
  suffix?: string;
}
```

### Card

```typescript
interface CardProps {
  title: string;
  module: 'logic' | 'sets' | 'graphs';
  children: ReactNode;
  onClick?: () => void;
}
```

### Table

```typescript
interface TableProps {
  headers: string[];
  data: boolean[][] | string[][];
  highlightedRows?: number[];
}
```

### Modal

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}
```

## Navegación

### Estructura de Rutas

```
/                    → Home
/logic               → Módulo de Lógica
/sets                → Módulo de Conjuntos
/sets/:setId         → Detalle de conjunto
/graphs             → Módulo de Grafos
/graphs/:graphId     → Detalle de grafo
/ai                 → Chat con IA
/help               → Centro de ayuda
/settings           → Configuración
```

### atajos de Teclado

| atajo | Acción |
|-------|--------|
| `Ctrl + 1` | Ir a Lógica |
| `Ctrl + 2` | Ir a Conjuntos |
| `Ctrl + 3` | Ir a Grafos |
| `Ctrl + L` | Limpiar entrada actual |
| `Ctrl + Enter` | Calcular/Ejecutar |
| `Escape` | Cerrar modal |
| `?` | Mostrar atajos |

## Responsividad

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

### Adaptaciones Móviles

- Cards apiladas verticalmente
- Tablas con scroll horizontal
- Canvas de grafos ocupa toda la pantalla
- Panel de herramientas en bottom sheet