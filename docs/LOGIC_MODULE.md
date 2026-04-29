# Módulo de Lógica Proposicional

## Conceptos Fundamentales

### Proposición

Una **proposición** es una oración declarativa que puede ser verdadera o falsa, pero no ambas simultáneamente. Es el bloque constructivo básico de la lógica proposicional.

**Ejemplos:**
- "Hoy es lunes" → Proposición verdadera o falsa
- "2 + 2 = 5" → Falsa
- "El cielo es azul" → Verdadera

### Variables Proposicionales

Las **variables proposicionales** (p, q, r, s...) representan proposiciones atómicas/simple. Cada variable puede tomar uno de dos valores: **verdadero (V o true)** o **falso (F o false)**.

### Conectores Lógicos

| Símbolo | Nombre | Descripción | Tabla de Verdad |
|--------|--------|------------|-----------------|
| ¬ | Negación | No p | V→F, F→V |
| ∧ | Conjunción | p Y q | VV→V, cualquier F→F |
| ∨ | Disyunción | p O q | FF→F, cualquier V→V |
| → | Implicación | Si p entonces q | VF→F, otros→V |
| ↔ | Bicondicional | p si y solo si q | Mismo valor→V |

### Precedencia de Operadores

Orden de evaluación (mayor a menor):
1. ¬ (negación)
2. ∧ (conjunción)
3. ∨ (disyunción)
4. → (implicación)
5. ↔ (bicondicional)

## Funcionalidades del Módulo

### 1. Generación de Tablas de Verdad

El sistema debe generar automáticamente todas las combinaciones posibles de valores de verdad para las variables ingresadas.

**Ejemplo: (p ∧ q) → r**

| p | q | r | p ∧ q | (p ∧ q) → r |
|---|---|---|-------|-------------|
| V | V | V | V | V |
| V | V | F | V | F |
| V | F | V | F | V |
| V | F | F | F | V |
| F | V | V | F | V |
| F | V | F | F | V |
| F | F | V | F | V |
| F | F | F | F | V |

### 2. Evaluación de Expresiones

El sistema debe evaluar expresiones lógicas dado un conjunto de valores de verdad.

**Interfaz del Parser:**
```typescript
interface LogicParser {
  parse(expression: string): AST;
  evaluate(ast: AST, values: Record<string, boolean>): boolean;
  getVariables(expression: string): string[];
}
```

### 3. Validación de Sintaxis

El sistema debe validar expresiones antes de evaluarlas:
- Paréntesis balanceados
- Variables válidas (regex: `/^[a-zA-Z][a-z-Z0-9]*$/`)
- Operadores válidos
- Máximo 5 variables proposicionales
- Sin errores de sintaxis

## Ejemplos de Uso

### Ejemplo 1: Tabla de Verdad Completa

**Entrada:**
```
(p ∨ q) → ¬r
```

**Salida:**
Tabla con 8 filas (2³ = 8 combinaciones para 3 variables)

### Ejemplo 2: Evaluación Puntual

**Entrada:**
- Expresión: `p ∧ (q ∨ r)`
- Valores: p = V, q = F, r = V

**Proceso:**
1. q ∨ r = F ∨ V = V
2. p ∧ (q ∨ r) = V ∧ V = V

**Resultado:** VERDADERO

### Ejemplo 3: Simplificación

**Entrada:** `¬(p ∧ q)`

**Aplicando De Morgan:** `¬p ∨ ¬q`

El sistema podría mostrar ambos formatos.

## Estructura de Componente

```typescript
interface LogicModule {
  // Input del usuario
  input: string;
  
  // Output visual
  variables: string[];
  truthTable: TruthTable;
  evaluatedResult?: boolean;
  error?: string;
}

interface TruthTable {
  headers: string[];
  rows: boolean[][];
}
```

## Diseño de Interfaz

### Barra de Entrada
- Campo de texto para expresión
- Botones para operadores: ¬ ∧ ∨ → ↔ ( )
- Selector de modo:编辑ar/Evaluar

### Tabla de Verdad
- Encabezados: Variables + Expresión completa
- Celdas editables para práctica
- Resaltado de fila/columna

### Panel de Resultados
- Valor de verdad final
- Explicación paso a paso
- Botón para IA: "Explicar"