# Módulo de Conjuntos

## Conceptos Fundamentales

### Conjunto

Un **conjunto** es una colección no ordenada de elementos únicos. Se representa usualmente con llaves {}.

**Ejemplos:**
- A = {1, 2, 3, 4}
- B = {a, b, c}
- ℕ = {0, 1, 2, 3, ...}

### Conjunto por Extensión

Se **define por extensión** cuando se listan explícitamente todos los elementos.

```
A = {1, 2, 3}
```

### Conjunto por Comprensión

Se **define por comprensión** cuando se describe la regla que generan los elementos.

```
A = {x ∈ ℕ | x < 5}  →  {0, 1, 2, 3, 4}
```

Notación: `{variable | condición}` o `{variable : condición}`

### Conjunto Universal

El **conjunto universal (U)** contiene todos los elementos bajo consideración en un contexto específico.

### Conjunto Vacío

El **conjunto vacío (∅ o {})** no contiene elementos.

## Operaciones con Conjuntos

### 1. Unión (∪)

Elementos que están en A, en B, o en ambos.

```
A ∪ B = {x | x ∈ A ∨ x ∈ B}
```

**Ejemplo:**
- A = {1, 2, 3}
- B = {3, 4, 5}
- A ∪ B = {1, 2, 3, 4, 5}

### 2. Intersección (∩)

Elementos comunes a ambos conjuntos.

```
A ∩ B = {x | x ∈ A ∧ x ∈ B}
```

**Ejemplo:**
- A = {1, 2, 3}
- B = {3, 4, 5}
- A ∩ B = {3}

### 3. Diferencia (-)

Elementos que están en A pero no en B.

```
A - B = {x | x ∈ A ∧ x ∉ B}
```

**Ejemplo:**
- A = {1, 2, 3}
- B = {3, 4, 5}
- A - B = {1, 2}

### 4. Complemento (∁ o A')

Elementos del universal que no están en A.

```
A' = U - A = {x ∈ U | x ∉ A}
```

**Ejemplo:**
- U = {1, 2, 3, 4, 5}
- A = {1, 2, 3}
- A' = {4, 5}

### 5. Diferencia Simétrica (△ o ⊕)

Elementos que están en A o en B pero no en ambos.

```
A △ B = (A - B) ∪ (B - A)
```

**Ejemplo:**
- A = {1, 2, 3}
- B = {3, 4, 5}
- A △ B = {1, 2, 4, 5}

### 6. Producto Cartesiano (×)

Conjunto de todos los pares ordenados.

```
A × B = {(a, b) | a ∈ A ∧ b ∈ B}
```

**Ejemplo:**
- A = {1, 2}
- B = {x, y}
- A × B = {(1,x), (1,y), (2,x), (2,y)}

### 7. Subconjunto (⊆)

A es subconjunto de B si todo elemento de A está en B.

```
A ⊆ B ≡ ∀x (x ∈ A → x ∈ B)
```

### 8. Potencia (P)

Conjunto de todos los subconjuntos.

```
P(A) = {X | X ⊆ A}
```

**Ejemplo:**
- A = {1, 2}
- P(A) = {∅, {1}, {2}, {1, 2}}

## Leyes de Conjuntos

### Identidades Fundamentales

| Ley | Nombre |
|-----|--------|
| A ∪ ∅ = A | Identidad |
| A ∩ U = A | Identidad |
| A ∪ A = A | Idempotencia |
| A ∩ A = A | Idempotencia |
| (A')' = A | Doble complementaria |
| A ∪ A' = U | Tercio excluso |
| A ∩ A' = ∅ | No contradicción |

### Leyes de De Morgan

| Ley | Forma |
|-----|-------|
| Primera | (A ∩ B)' = A' ∪ B' |
| Segunda | (A ∪ B)' = A' ∩ B' |

## Funcionalidades del Módulo

### 1. Creación de Conjuntos

**Entrada por extensión:**
```
Input: 1, 2, 3
Output: A = {1, 2, 3}
```

**Entrada por comprensión:**
```
Input: x | x ∈ ℕ, x < 5
Output: A = {0, 1, 2, 3, 4}
```

### 2. Operaciones Binarias

El usuario selecciona:
1. Conjunto A
2. Operación (∪, ∩, -, △)
3. Conjunto B

**Resultado:** Nuevo conjunto con el resultado

### 3. Visualización con Diagramas de Venn

Los diagramas de Venn muestran regiones sombreadas para cada operación:
- Unión: Todo excepto lo no cubierto por nenhum
- Intersección: Solo la región común
- Diferencia: Solo la parte de A que no es B

### 4. Cardinalidad

```
|A| = número de elementos en A
```

Para cardinalidades grandes, usar principio de inclusión-exclusión:
```
|A ∪ B| = |A| + |B| - |A ∩ B|
```

## Estructura de Datos

```typescript
interface Set<T> {
  elements: T[];
  type: 'extension' | 'comprehension';
  name?: string;
}

interface SetOperation {
  type: 'union' | 'intersection' | 'difference' | 'symmetric-diff';
  setA: Set<any>;
  setB: Set<any>;
}

interface VennRegion {
  inA: boolean;
  inB: boolean;
  shade: boolean;
}
```

## Diseño de Interfaz

### Panel de Conjuntos
- Lista de conjuntos creados
- Botón: "Nuevo Conjunto"
- Input: elementos o regla
- Opciones: numeric, string, custom

### Panel de Operaciones
- Selector: Conjunto ADropdown
- Botones de operación: ∪ ∩ - △ '
- Selector: Conjunto BDropdown
- Botón: "Calcular"

### Panel de Resultado
- Conjunto resultado en notación
- Cardinalidad
- Diagrama de Venn animado
- Explicación paso a paso

## Ejemplo de Flujo

1. Usuario crea A = {1, 2, 3, 4}
2. Usuario crea B = {3, 4, 5, 6}
3. Selecciona operación: A ∩ B
4. Sistema muestra:
   - Resultado: {3, 4}
   - Cardinalidad: 2
   - Diagrama: región intersectada sombreada