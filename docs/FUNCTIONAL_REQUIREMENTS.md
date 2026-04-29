# Requisitos Funcionales

## 1. Módulo de Lógica Proposicional

### 1.1 Ingreso de Proposiciones
- El sistema debe permitir al usuario ingresar proposiciones atómicas (p, q, r, etc.)
- El usuario debe poder definir conectores lógicos: ¬ (negación), ∧ (conjunción), ∨ (disyunción), → (implicación), ↔ (bicondicional)
- La interfaz debe mostrar una barra de entrada intuitiva con botones para cada conector

### 1.2 Generación de Tablas de Verdad
- El sistema debe generar automáticamente la tabla de verdad completa
- Debe mostrar todas las combinaciones posibles de valores de verdad
- La tabla debe ser editable y permitir al usuario marcar sus respuestas

### 1.3 Evaluación de Expresiones
- El sistema debe evaluar expresiones lógicas complejas
- Debe validar la sintaxis de las expresiones ingresadas
- Debe mostrar errores claros cuando la expresión sea inválida

## 2. Módulo de Conjuntos

### 2.1 Creación de Conjuntos
- El usuario debe poder crear conjuntos por extensión (listando elementos)
- El usuario debe poder crear conjuntos por comprensión (usando regla de formación)
- Se deben aceptar conjuntos de números, letras, o elementos personalizados

### 2.2 Operaciones con Conjuntos
- **Unión (∪)**: Combinar todos los elementos de ambos conjuntos
- **Intersección (∩)**: Elementos comunes a ambos conjuntos
- **Diferencia (-)**: Elementos del primero sin los del segundo
- **Complemento**: Elementos no contenidos en el conjunto respecto al universal
- **Producto Cartesiano**: Pares ordenados de ambos conjuntos

### 2.3 Visualización
- Mostrar diagramas de Venn para operaciones binarias
-动画 de transición entre estados

## 3. Módulo de Grafos

### 3.1 Creación de Grafos
- El usuario debe poder agregar nodos con identificadores únicos
- El usuario debe poder agregar aristas entre nodos
- Soporte para grafos dirigidos y no dirigida es
- Pesos opcionales en las aristas

### 3.2 Algoritmos de Recorrido
- **BFS (Breadth-First Search)**: Recorrido en anchura
- **DFS (Depth-First Search)**: Recorrido en profundidad
- Mostrar paso a paso el orden de visita de nodos

### 3.3 Representación
- Mostrar lista de adyacencia del grafo actual
- Visualización de matriz de adyacencia (opcional)
- Representación visual del grafo con nodos y aristas

## 4. Integración de IA

### 4.1 Explicación de Resultados
- Generar explicaciones en lenguaje natural de los resultados
- Explicar el paso a paso de los algoritmos

### 4.2 Generación de Ejercicios
- Crear ejercicios aleatorios para práctica
- Validar respuestas del usuario

### 4.3 Interpretación de Lenguaje Natural
- Permitir ingreso de expresiones en texto libre
- Traducir a форма lógica formal