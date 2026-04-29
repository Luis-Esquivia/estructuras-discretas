# Módulo de Grafos

## Conceptos Fundamentales

### Grafo

Un **grafo** G = (V, E) consiste en un conjunto V de **vértices** (o nodos) y un conjunto E de **aristas** (o arcos) que conectan pares de vértices.

### Nodo (Vértice)

Elemento fundamental del grafo:
```
V = {1, 2, 3, 4}
```

Cada nodo puede tener:
- **Identificador único** (número, letra, string)
- **Etiquetas/pesos** opcionales
- **Estado** (visitado/no visitado durante algoritmos)

### Arista (Arco)

Conexión entre dos nodos:
```
E = {(1,2), (2,3), (3,4)}
```

Propiedades:
- **Dirigida/No dirigida**: Dirección de la conexión
- **Peso**: Valor numérico opcional
- **Bidireccional**: En grafos no dirigidos, cada arista se representa como dos dirigidas

### Grafo Dirigido vs No Dirigido

**No dirigido:** La arista {A, B} conecta A con B bidireccionalmente.

**Dirigido:** La arista (A, B) va de A hacia B únicamente.

```
No dirigido:     Dirigido:
   A---B           A → B
   |   |           ↓   ↓
   C---D           C → D
```

## Representaciones

### Lista de Adyacencia

Para cada nodo, lista los nodos vecinos:

```typescript
interface AdjacencyList {
  [node: string]: string[];
}

// Ejemplo: Grafo dirigido
// 1 → 2 → 3
// 1 → 4
const adjList: AdjacencyList = {
  '1': ['2', '4'],
  '2': ['3'],
  '3': [],
  '4': []
};
```

### Matriz de Adyacencia

Matriz N×N donde M[i][j] = 1 si hay arista de i a j:

```
     1  2  3  4
  ┌──────────────
1 │  0  1  0  1
2 │  0  0  1  0
3 │  0  0  0  0
4 │  0  0  0  0
```

### Representación Visual

Los nodos se muestran como círculos etiquetados y las aristas como líneas/flechas entre ellos.

## Algoritmos de Recorrido

### BFS - Breadth-First Search (Búsqueda en Anchura)

Explora todos los vecinos antes de pasar al siguiente nivel.

**Características:**
- Usa cola (FIFO)
- Encuentra el camino más corto en grafos no ponderados
- Complejidad: O(V + E)

**Ejemplo de recorrido:**
```
Nivel 0: Inicio
Nivel 1: Vecinos directos
Nivel 2: Vecinos de vecinos
...
```

**Pseudocódigo:**
```
BFS(G, inicio):
  Cola cola = [inicio]
  Visitados = {inicio}
  
  Mientras cola no vacía:
    actual = cola.pop()
    Para cada vecino de actual:
      Si vecino no visitado:
        marcar visitado
        cola.push(vecino)
```

**Proceso visual:**
1. Marcar inicio como "visitando" (color amarillo)
2. Agregar vecinos a cola
3. Procesar cola, marcar nodos visitados (verde)
4. Mostrar arista seleccionada

### DFS - Depth-First Search (Búsqueda en Profundidad)

Explora tan profundo como sea posible antes de retroceder.

**Características:**
- Usa pila (LIFO)
- Buena para detección de ciclos
- Complejidad: O(V + E)

**Ejemplo de recorrido:**
```
Profundidad 0: Inicio
Profundidad 1: Primer vecino
Profundidad 2: Vecino del vecino
Backtrack cuando callejón sin salida
```

**Pseudocódigo:**
```
DFS(G, inicio):
  Pila pila = [inicio]
  Visitados = {}
  
  Mientras pila no vacía:
    actual = pila.pop()
    Si actual no visitado:
      marcar visitado
      Para cada vecino de actual:
        Si vecino no visitado:
          pila.push(vecino)
```

**Proceso visual:**
1. Marcar inicio
2. Ir al primer vecino no visitado
3. Repetir hasta llegar a nodo sin vecinos
4. Backtrack y continuar

## Funcionalidades del Módulo

### 1. Creación de Grafos

**Agregar Nodos:**
- Click en canvas para agregar
- Input manual para nombrar
- Eliminar nodo seleccionado

**Agregar Aristas:**
- Seleccionar nodo origen
- Seleccionar nodo destino
- Definir si es dirigida
- Asignar peso (opcional)

### 2. Edición

- Mover nodos arrastrando
- Eliminar aristas
- Cambiar dirección
- Editar pesos

### 3. Algoritmos Interactivos

**BFS Interactivo:**
- Botón "Iniciar BFS"
- Selección de nodo inicial
- Animación paso a paso
- Panel mostrando cola actual
- Orden de visita

**DFS Interactivo:**
- Botón "Iniciar DFS"
- Selección de nodo inicial
- Animación paso a paso
- Panel mostrando pila actual
- Orden de visita

### 4. Visualización

- **Vista de nodos**: Canvas interactivo
- **Lista de adyacencia**: Panel lateral
- **Matriz de adyacencia**: Vista opcional
- **Recorrido**: Resaltado de nodos/aristas

## Estructura de Datos

```typescript
interface Node {
  id: string;
  x: number;
  y: number;
  label?: string;
  weight?: number;
}

interface Edge {
  source: string;
  target: string;
  directed: boolean;
  weight?: number;
}

interface Graph {
  id: string;
  nodes: Node[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
}

interface TraversalResult {
  order: string[];           // Orden de visita
  steps: TraversalStep[];   // Cada paso
  visited: Set<string>;      // Nodos visitados
}

interface TraversalStep {
  current: string;
  queue?: string[];          // Estado de cola/pila (BFS)
  stack?: string[];          // Estado de pila (DFS)
  visited: string[];
  traversedEdge?: [string, string];
}
```

## Diseño de Interfaz

### Panel de Grafos (Canvas)
- Área interactiva para dibujar nodos
- Líneas de conexión con flechas
- Drag & drop de nodos
- Zoom in/out

### Barra de Herramientas
- Botón: "Agregar Nodo"
- Botón: "Agregar Arista"
- Toggle: "Dirigido/No Dirigido"
- Selector de nodo inicial para algoritmos

### Panel de Algoritmos
- Botones: BFS, DFS
- Selector de nodo inicio
- Velocidad de animación
- Botón: "Siguiente Paso"
- Botón: "Reset"

### Panel de Resultados
- Lista de adyacencia actualizada
- Orden de recorrido
- Estadísticas: nodos, aristas, grado

## Ejemplo de Uso

**Grafo de ejemplo:**
```
    A → B
    ↓   ↓
    C → D
```

**BFS desde A:**
1. Cola: [A] → Visitar: [A]
2. Cola: [B, C] → Visitar: [A, B, C]
3. Cola: [C, D] → Visitar: [A, B, C, D]
4. Cola: [D] → Visitar: [A, B, C, D]

**Resultado:** A, B, C, D

**DFS desde A:**
1. PilA: [A] → Visitar: [A]
2. PilA: [C, B] → Visitar: [A, C]
3. PilA: [D, B] → Visitar: [A, C, D]
4. PilA: [B] → Visitar: [A, C, D, B]

**Resultado:** A, C, D, B (o A, B, D, C según implementación)