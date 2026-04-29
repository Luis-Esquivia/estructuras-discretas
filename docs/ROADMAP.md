# Roadmap de Desarrollo

## Visión General

El desarrollo se estructura en **4 fases principales**, priorizando la entrega de valor incremental. Cada fase culmina con features funcionales y testeables.

---

## Fase 1: Fundamentos de Lógica ⚡

**Objetivo:** Implementar el módulo de lógica proposicional completo.

**Duración estimada:** 2 semanas

**Entregables:**

### Semana 1
- [ ] Configuración del proyecto Angular 18+ con signals
- [ ] Routing básico con lazy loading
- [ ] Componente de entrada para expresiones lógicas
- [ ] Parser básico para conectores (¬, ∧, ∨, →, ↔)
- [ ] Validación de sintaxis de expresiones

### Semana 2
- [ ] Generación de tablas de verdad
- [ ] Algoritmo recursivo para generar combinaciones
- [ ] Componente visual de tabla
- [ ] Clasificación: tautología, contradicción, contingencia
- [ ] Tests unitarios del módulo

**Criterio de aceptación:**
```
Entrada: (p ∧ q) → r
Output: Tabla completa con 8 filas
Evaluación: Correcta para todas las combinaciones
```

---

## Fase 2: Módulo de Conjuntos 🎯

**Objetivo:** Sistema completo de creación y operaciones con conjuntos.

**Duración estimada:** 2 semanas

**Entregables:**

### Semana 3
- [ ] Estructura de datos para conjuntos
- [ ] Creación por extensión (input de elementos)
- [ ] Creación por comprensión (con rango)
- [ ] Servicio de operaciones básicas

### Semana 4
- [ ] Operaciones: unión, intersección, diferencia
- [ ] Operaciones: complemento, diferencia simétrica
- [ ] Producto cartesiano
- [ ] Diagrama de Venn (canvas SVG)
- [ ] Tests del módulo

**Criterio de aceptación:**
```
A = {1,2,3}, B = {3,4,5}
A ∪ B = {1,2,3,4,5}
A ∩ B = {3}
Diagrama muestra regiones correctas
```

---

## Fase 3: Módulo de Grafos 🔷

**Objetivo:** Creación interactiva de grafos y algoritmos de recorrido.

**Duración estimada:** 3 semanas

**Entregables:**

### Semana 5
- [ ] Modelo de datos: Node, Edge, Graph
- [ ] Canvas interactivo con Angular
- [ ] Agregar/mover/eliminar nodos
- [ ] Agregar/eliminar aristas

### Semana 6
- [ ] Toggle dirigido/no dirigido
- [ ] Lista de adyacencia (actualización en tiempo real)
- [ ] Algoritmo BFS con animación
- [ ] Cola visual para BFS

### Semana 7
- [ ] Algoritmo DFS con animación
- [ ] Pila visual para DFS
- [ ] Selector de nodo inicial
- [ ] Tests de algoritmos

**Criterio de aceptación:**
```
Grafo: 1→2, 2→3, 3→4
BFS desde 1: [1, 2, 3, 4]
DFS desde 1: [1, 2, 3, 4]
Lista de adyacencia actualizada
```

---

## Fase 4: Integración de IA ✨

**Objetivo:** Asistente IA para explicaciones y generación de ejercicios.

**Duración estimada:** 2 semanas

**Entregables:**

### Semana 8
- [ ] Diseño de backend (Express/NestJS)
- [ ] Integración con OpenAI API
- [ ] Endpoint: POST /ai/explain
- [ ] Prompt engineering para explicaciones
- [ ] Cache de respuestas

### Semana 9
- [ ] Endpoint: POST /ai/generate-exercise
- [ ] Endpoint: POST /ai/parse (lenguaje natural)
- [ ] UI del chat de IA
- [ ] Rate limiting
- [ ] Tests de integración

**Criterio de aceptación:**
```
Usuario: "Explica por qué (p → q) ∧ p implica q"
Sistema: Explicación paso a paso con conectores
Generación de ejercicio aleatorio funcional
```

---

## Fase 5: Polish & Optimización 🔥

**Duración estimada:** 1 semana

**Entregables:**
- [ ] Animaciones suaves entre estados
- [ ] Responsive design para tablet
- [ ] atajos de teclado
- [ ] Documentación de usuario
- [ ] Optimización de performance
- [ ] Tests E2E con Playwright

---

## Timeline Visual

```
Mes 1    Mes 2    Mes 3    Mes 4
────────────────────────────────────
[FASE 1] [FASE 2] [FASE 3] [FASE 4]
 Lógica  Conjuntos Grafos   IA
                          [FASE 5]
                          Polish
```

**Total estimado:** 10 semanas (2.5 meses)

---

## Dependencias Externas

### APIs y Servicios
- **OpenAI API**: Para integración de IA
- **Angular CDK**: Para drag & drop en grafos
- **D3.js o similar**: Para visualización de grafos (opcional)

### Herramientas de Desarrollo
- **Vitest**: Testing unitario
- **Playwright**: Testing E2E
- **ESLint + Prettier**: Calidad de código

---

## Milestones

| Milestone | Fecha | Descripción |
|-----------|-------|-------------|
| M1 | Semana 2 | MVP de lógica con tablas de verdad |
| M2 | Semana 4 | Módulo de conjuntos funcional |
| M3 | Semana 6 | Primeros algoritmos de grafos |
| M4 | Semana 7 | BFS/DFS completos con animación |
| M5 | Semana 8 | Alpha con IA básica |
| M6 | Semana 9 | Beta con todas las features |
| M7 | Semana 10 | Release v1.0.0 |

---

## Risks y Mitigaciones

| Risk | Impact | Mitigation |
|------|--------|------------|
| Canvas de grafos demasiado lento | Alto | Usar WebGL o Canvas nativo, no SVG para >100 nodos |
| API de IA costosa | Medio | Cache agresiva, fallback a respuestas predefinidas |
| Parser de expresiones incompleto | Alto | Empezar con caso simple, extender gradualmente |
| Performance con tablas >6 variables | Medio | Paginar o virtualizar la tabla |

---

## Release Plan

### v1.0.0 (Mes 3)
- Módulos Lógica, Conjuntos, Grafos completos
- IA integrada (versión básica)
- Responsive mobile

### v1.1.0 (Mes 4)
- Más tipos de grafos (ponderados, multipartitos)
- Ejercicios aleatorios
- Exportar a imagen

### v2.0.0 (Mes 6)
- Autenticación (opcional)
- Guardar progreso
- Historial de operaciones