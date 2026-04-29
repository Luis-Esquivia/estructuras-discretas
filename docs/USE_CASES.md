# Casos de Uso

## Módulo de Lógica Proposicional

### Caso de Uso 1: Generar Tabla de Verdad

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante ingresa expresión lógica (ej: `p → q`)
2. Sistema parsea y valida la expresión
3. Sistema extrae variables (p, q)
4. Sistema genera tabla con todas las combinaciones
5. Sistema muestra resultado con formato visual

**Flujo Alternativo:**
- Si la expresión es inválida, mostrar error específico
- Si hay variables no usadas, mostrar warning

**Ejemplo:**
```
Input: (p ∨ q) ∧ ¬r
Variables detectadas: p, q, r
Output: Tabla con 8 filas (2³ combinaciones)
```

---

### Caso de Uso 2: Evaluar Expresión Específica

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante ingresa expresión lógica
2. Estudiante selecciona modo "Evaluar"
3. Estudiante ingresa valores para cada variable
4. Sistema calcula resultado final
5. Sistema muestra cada paso del cálculo

**Flujo Alternativo:**
- Si falta algún valor, solicitar input faltante
- Mostrar mensaje de error si valores inválidos

**Ejemplo:**
```
Input: p ∧ (q ∨ r)
Valores: p = V, q = F, r = V
Paso 1: q ∨ r = F ∨ V = V
Paso 2: p ∧ V = V ∧ V = V
Resultado: VERDADERO
```

---

### Caso de Uso 3: Identificar Tipo de Proposición

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante ingresa expresión
2. Sistema genera tabla de verdad completa
3. Sistema analiza columna de resultado
4. Sistema clasifica: Tautología / Contradicción / Contingencia
5. Sistema muestra clasificación con explicación

**Ejemplo:**
```
Expresión: p ∨ ¬p
Tabla de verdad: todos V
Clasificación: TAUTOLOGÍA
Explicación: "Ley del tercio excluso"
```

## Módulo de Conjuntos

### Caso de Uso 4: Crear y Operar Conjuntos

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante crea conjunto A (por extensión)
2. Estudiante crea conjunto B (por extensión)
3. Estudiante selecciona operación (ej: ∪)
4. Sistema calcula A ∪ B
5. Sistema muestra resultado y diagrama de Venn

**Ejemplo:**
```
A = {1, 2, 3}
B = {3, 4, 5}
Operación: A ∩ B
Resultado: {3}
Diagrama: Región común sombreada
```

---

### Caso de Uso 5: Crear Conjunto por Comprensión

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante selecciona "Crear por comprensión"
2. Estudiante ingresa regla (ej: x ∈ ℕ, x < 5)
3. Estudiante ingresa rango o universo
4. Sistema genera elementos que cumplen la regla
5. Sistema muestra conjunto resultante

**Ejemplo:**
```
Regla: {x | x ∈ ℕ, 2 < x < 8}
Universo: ℕ = {0, 1, 2, 3, 4, 5, 6, 7, 8, ...}
Resultado: {3, 4, 5, 6, 7}
```

---

### Caso de Uso 6: Verificar Subconjuntos

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante selecciona conjunto A
2. Estudiante selecciona conjunto B
3. Sistema verifica si A ⊆ B
4. Sistema muestra resultado con justificación

**Ejemplo:**
```
A = {1, 2}
B = {1, 2, 3, 4}
A ⊆ B? SÍ
Justificación: Todos los elementos de A están en B
```

## Módulo de Grafos

### Caso de Uso 7: Crear Grafo Interactivo

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante hace click en canvas para crear nodo 1
2. Estudiante hace click para crear nodo 2
3. Estudiante selecciona crear arista
4. Estudiante selecciona nodo origen y destino
5. Sistema dibuja arista
6. Sistema actualiza lista de adyacencia

**Ejemplo:**
```
Nodos creados: A, B, C
Aristas: A→B, B→C, C→A
Lista de adyacencia:
- A: [B]
- B: [C]
- C: [A]
```

---

### Caso de Uso 8: Ejecutar BFS

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante ha creado un grafo
2. Estudiante selecciona "BFS" en panel de algoritmos
3. Estudiante selecciona nodo de inicio (A)
4. Sistema inicia recorrido
5. Sistema muestra paso a paso:
   - Cola actual
   - Nodo procesándose
   - Orden de visita
6. Sistema completa al procesar todos los nodos

**Ejemplo:**
```
Grafo: A→B, A→C, B→D, C→D
Inicio: A

Paso 1: Cola=[A], Visitado=[A]
Paso 2: Cola=[B,C], Visitado=[A,B]
Paso 3: Cola=[C,D], Visitado=[A,B,C]
Paso 4: Cola=[D], Visitado=[A,B,C,D]
Orden final: A, B, C, D
```

---

### Caso de Uso 9: Ejecutar DFS

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante ha creado un grafo
2. Estudiante selecciona "DFS" en panel de algoritmos
3. Estudiante selecciona nodo de inicio (A)
4. Sistema inicia recorrido
5. Sistema muestra paso a paso:
   - Pila actual
   - Nodo procesándose
   - Orden de visita
6. Sistema completa al procesar todos los nodos

**Ejemplo:**
```
Grafo: A→B, B→C, C→D
Inicio: A

Paso 1: PilA=[A], Visitado=[A]
Paso 2: PilA=[B], Visitado=[A,B]
Paso 3: PilA=[C], Visitado=[A,B,C]
Paso 4: PilA=[D], Visitado=[A,B,C,D]
Orden final: A, B, C, D
```

## Integración de IA

### Caso de Uso 10: Explicación con IA

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante completa una operación (tabla, conjuntos, grafo)
2. Estudiante hace click en botón "Explicar" (icono IA)
3. Sistema envía contexto a servicio de IA
4. Sistema muestra explicación generada
5. Estudiante puede hacer preguntas de seguimiento

**Ejemplo:**
```
Tabla generada: (p → q) ∧ p
Estudiante pregunta: "¿Por qué es tautología?"
IA responde: "Esta expresión es el Modus Ponens..."
```

---

### Caso de Uso 11: Generar Ejercicio

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante selecciona módulo (Lógica, Conjuntos, Grafos)
2. Estudiante selecciona dificultad
3. Estudiante hace click en "Generar Ejercicio"
4. Sistema genera enunciado y respuesta
5. Estudiante intenta resolver
6. Sistema valida respuesta y muestra feedback

**Ejemplo:**
```
Módulo: Conjuntos
Dificultad: Intermedio

Ejercicio generado:
"Dados A={1,2,3} y B={2,3,4}, calcula (A∩B) ∪ (A-B)"
Respuesta esperada: {2,3}
```

---

### Caso de Uso 12: Interpretar Lenguaje Natural

**Actor:** Estudiante

**Flujo Básico:**
1. Estudiante escribe en lenguaje natural
2. Estudiante selecciona "Interpretar"
3. Sistema parsea el texto
4. Sistema muestra formalismo equivalente
5. Estudiante puede aceptar o editar

**Ejemplo:**
```
Input: "la negación de p y q"
Output: ¬(p ∧ q)

Input: "A unión B intersección C"
Output: A ∪ (B ∩ C)
```