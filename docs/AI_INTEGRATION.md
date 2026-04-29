# Integración de IA

## Objetivo

Utilizar inteligencia artificial para mejorar la experiencia educativa del estudiante, proporcionando explicaciones personalizadas, generación automática de ejercicios y asistencia en la interpretación de expresiones.

## Funcionalidades

### 1. Explicación de Resultados

**Tablas de Verdad:**
- ¿Por qué esta combinación resulta en verdadero/falso?
- Explicación paso a paso de cada conector
- Identificación de patrones (tautología, contradicción, contingencia)

**Conjuntos:**
- Explicación de operaciones paso a paso
- Visualización de ley utilizada
- Verificación de pertenencia de elementos

**Grafos:**
- Explicación del recorrido BFS/DFS
- Justificación del orden de visita
- Detección de ciclos o componentes conectados

**Ejemplo de Output:**
```
"Para la expresión (p ∧ q) → r, cuando p=V, q=V, r=F:

1. Primero evaluamos p ∧ q:
   - p = V y q = V
   - V ∧ V = V (conjunción verdadera solo si ambos son V)

2. Luego evaluamos (p ∧ q) → r:
   - Tenemos V → F
   - La implicación es falsa SOLO cuando el antecedente es V 
     y el consecuente es F

3. Resultado: FALSO"
```

### 2. Generación de Ejercicios

**Tipos de ejercicios:**
- Completar tablas de verdad
- Identificar tipo de proposición (tautología/contradicción)
- Dados dos conjuntos, calcular operaciones
- Dados grafos, ejecutar algoritmos

**Niveles de dificultad:**
- Básico: 2 variables, expresiones simples
- Intermedio: 3-4 variables, paréntesis anidados
- Avanzado: 5+ variables, múltiples operaciones

**Ejemplo de ejercicio generado:**
```
"Ejercicio: Calcula A ∪ B dado:
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

a) {1, 2, 3, 4, 5, 6}
b) {3, 4}
c) {1, 2}
d) {1, 2, 3, 4, 5, 6, 7}
```

### 3. Interpretación de Lenguaje Natural

Traducir descripciones textuales a formalism o matemático.

**Ejemplos:**

| Lenguaje Natural | Formalismo |
|-----------------|------------|
| "p y q son ambos verdaderos" | p ∧ q |
| "no es cierto que p" | ¬p |
| "p implica q" | p → q |
| "si llueve entonces me mojo" | lluvia → mojado |
| "A contiene a 1, 2 y 3" | A = {1, 2, 3} |
| "A es subconjunto de B" | A ⊆ B |

**Funcionalidades de parsing:**
- Reconocimiento de conectivos lógicos
- Detección de cuantificadores
- Identificación de operaciones con conjuntos

### 4. Tutor Interactivo

Chat para responder preguntas específicas del estudiante.

**Casos de uso:**
- "¿Por qué esta tabla es una tautología?"
- "¿Cómo funciona el algoritmo BFS?"
- "¿Qué son los conectores lógicos?"

## Posible Implementación

### Arquitectura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│  OpenAI API │
│   (Angular) │     │   (Node.js)  │     │             │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  Rate Limit │
                    │    Cache    │
                    └─────────────┘
```

### Endpoints del Backend

```typescript
// POST /api/ai/explain
interface ExplainRequest {
  type: 'truth-table' | 'set-operation' | 'graph-traversal';
  data: any;  // Datos específicos
  context: string;  // Contexto adicional
}

interface ExplainResponse {
  explanation: string;
  steps: Step[];
  confidence: number;
}

// POST /api/ai/generate-exercise
interface GenerateRequest {
  topic: 'logic' | 'sets' | 'graphs';
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

interface Exercise {
  id: string;
  question: string;
  options?: string[];
  answer: any;
  explanation: string;
}

// POST /api/ai/parse
interface ParseRequest {
  text: string;
  targetType: 'proposition' | 'set' | 'graph';
}

interface ParseResponse {
  parsed: any;
  confidence: number;
  suggestions?: string;
}
```

### Prompt Engineering

**System Prompt Base:**
```
Eres un tutor especializado en estructuras discretas para estudiantes universitarios.
Tu objetivo es ayudar a comprender conceptos, no solo dar respuestas.
Usa ejemplos concretos y explica el razonamiento paso a paso.
Sé paciente y usa lenguaje accesible para estudiantes.
```

**Prompt para tablas de verdad:**
```
Explica la tabla de verdad de la expresión: {expresión}
Incluye:
1. Significado de cada conector
2. Evaluación paso a paso
3. Identificación del tipo (tautología/contradicción/contingencia)
4. Sugerencias para practicar
```

### Optimizaciones

**Caching:**
- Guardar respuestas similares por hash de expresión
- TTL de 1 hora para explicaciones
- Invalidar cuando cambien los datos

**Rate Limiting:**
- Máximo 10 requests/minuto por usuario
- Cola de requests si se excede
- Feedback al usuario durante espera

**Fallback:**
- Respuestas predefinidas para casos comunes
- Mensaje de "no pude entender" si falla IA
- Sugerencia de reformular la pregunta

### Consideraciones de Seguridad

- **API Keys**: Almacenar en variables de entorno
- **Sanitización**: Validar inputs antes de enviar
- **Costos**: Limitar número de llamadas
- **Privacidad**: No guardar historial de consultas

## Roadmap de IA

### Fase 1: MVP (v1.0)
- Explicaciones básicas de tablas de verdad
- Respuestas predefinidas sin costo de API

### Fase 2: OpenAI Integration (v2.0)
- API de OpenAI (GPT-4o mini para costo-efectividad)
- Explicaciones personalizadas
- Generación de ejercicios

### Fase 3: Advanced (v3.0)
- Chat interactivo con contexto de sesión
- Detección de conceptos misunderstand
- Recomendaciones personalizadas de práctica