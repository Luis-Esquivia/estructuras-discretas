import { Injectable, signal } from '@angular/core';

// Types
interface AIResponse {
  text: string;
  steps?: string[];
  confidence: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI Service - Hybrid approach (Predefined + OpenAI ready)
@Injectable({ providedIn: 'root' })
export class AIService {
  // API Key (opcional - usar predefinidas si no está configurada)
  private apiKey: string | null = null;
  private useApi = false;
  
  // Chat history
  readonly messages = signal<ChatMessage[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  
  constructor() {
    // Check for API key in environment
    // this.apiKey = environment.openaiApiKey;
    // this.useApi = !!this.apiKey;
  }
  
  // Explain truth table for logic module
  explainTruthTable(expression: string, variables: string[], table: { values: Record<string, boolean>; result: boolean }[], classification: string): AIResponse {
    const varList = variables.join(', ');
    
    // Generate explanation based on expression
    const explanation = this.generateLogicExplanation(expression, variables, classification);
    
    return {
      text: explanation,
      steps: this.generateLogicSteps(expression, variables, table),
      confidence: 0.95
    };
  }
  
  // Explain set operation
  explainSetOperation(setA: any[], setB: any[], operation: string, result: any[]): AIResponse {
    const opNames: Record<string, string> = {
      'union': 'union',
      'intersection': 'interseccion',
      'difference': 'diferencia',
      'symmetric-diff': 'diferencia simetrica',
      'complement': 'complemento'
    };
    
    let explanation = `La ${opNames[operation] || operation} de los conjuntos:\n\n`;
    explanation += `A = {${setA.join(', ')}}\n`;
    explanation += `B = {${setB.join(', ')}}\n\n`;
    
    switch (operation) {
      case 'union':
        explanation += `La union A U B contiene todos los elementos que estan en A, en B, o en ambos. `;
        explanation += `Resultado: {${result.join(', ')}}.`;
        break;
      case 'intersection':
        explanation += `La interseccion A n B contiene solo los elementos que estan en AMBOS conjuntos. `;
        explanation += `Los elementos comunes son: {${result.join(', ')}}.`;
        break;
      case 'difference':
        explanation += `La diferencia A - B contiene los elementos de A que NO estan en B. `;
        explanation += `Elementos resultantes: {${result.join(', ')}}.`;
        break;
      case 'symmetric-diff':
        explanation += `La diferencia simetrica A △ B contiene elementos que estan en A o B, pero NO en ambos. `;
        explanation += `Resultado: {${result.join(', ')}}.`;
        break;
      case 'complement':
        explanation += `El complemento A' contiene todos los elementos del universal que NO estan en A. `;
        explanation += `Elementos: {${result.join(', ')}}.`;
        break;
    }
    
    return {
      text: explanation,
      confidence: 0.95
    };
  }
  
  // Explain graph traversal
  explainTraversal(type: 'bfs' | 'dfs', startNode: string, order: string[], graphDescription: string): AIResponse {
    const algoName = type === 'bfs' ? 'BFS (Breadth-First Search)' : 'DFS (Depth-First Search)';
    
    let explanation = `${algoName} desde el nodo "${startNode}":\n\n`;
    explanation += `Orden de visita: ${order.join(' -> ')}\n\n`;
    
    if (type === 'bfs') {
      explanation += `BFS explora nivel por nivel:\n`;
      explanation += `1. Primero visita todos los vecinos directos del nodo inicial\n`;
      explanation += `2. Luego los vecinos de esos vecinos\n`;
      explanation += `3. Utiliza una COLA (FIFO) - primero en entrar, primero en salir\n`;
      explanation += `4. Es util para encontrar el camino mas corto en grafos no ponderados\n`;
    } else {
      explanation += `DFS explora lo mas profundo posible antes de retroceder:\n`;
      explanation += `1. Toma el primer vecino no visitado\n`;
      explanation += `2. Continua hasta llegar a un nodo sin vecinos no visitados\n`;
      explanation += `3. Backtrack y repite\n`;
      explanation += `4. Utiliza una PILA (LIFO) - ultimo en entrar, primero en salir\n`;
      explanation += `5. Es util para detectar ciclos y componentes conectados\n`;
    }
    
    return {
      text: explanation,
      confidence: 0.95
    };
  }
  
  // Generate exercise
  generateExercise(topic: 'logic' | 'sets' | 'graphs', difficulty: 'easy' | 'medium' | 'hard'): AIResponse {
    switch (topic) {
      case 'logic':
        return this.generateLogicExercise(difficulty);
      case 'sets':
        return this.generateSetsExercise(difficulty);
      case 'graphs':
        return this.generateGraphExercise(difficulty);
      default:
        return { text: 'Topic not supported yet', confidence: 0 };
    }
  }
  
  // Chat with AI
  async chat(message: string): Promise<AIResponse> {
    // Add user message
    const userMsg: ChatMessage = {
      id: this.genId(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    this.messages.update(m => [...m, userMsg]);
    
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      // If API key available, use OpenAI
      if (this.useApi && this.apiKey) {
        return await this.callOpenAI(message);
      }
      
      // Otherwise use predefined responses
      const response = this.getPredefinedResponse(message);
      
      // Add assistant message
      const assistantMsg: ChatMessage = {
        id: this.genId(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date()
      };
      this.messages.update(m => [...m, assistantMsg]);
      
      this.isLoading.set(false);
      return response;
      
    } catch (err) {
      this.error.set('Error al procesar la solicitud');
      this.isLoading.set(false);
      return { text: 'Lo siento, no pude procesar tu pregunta. Intenta reformularla.', confidence: 0 };
    }
  }
  
  // Clear chat
  clearChat() {
    this.messages.set([]);
  }
  
  // Private helpers
  
  private generateLogicExplanation(expr: string, vars: string[], classification: string): string {
    const connectors = this.identifyConnectors(expr);
    
    let explanation = `Analicemos la expresion: ${expr}\n\n`;
    explanation += `Variables: ${vars.join(', ')}\n`;
    explanation += `Numero de combinaciones: ${Math.pow(2, vars.length)}\n\n`;
    
    explanation += `Clasificacion: **${classification}**\n\n`;
    
    explanation += `Conectores utilizados:\n`;
    connectors.forEach(c => {
      explanation += `- ${c.name}: ${c.desc}\n`;
    });
    
    explanation += `\n`;
    explanation += this.getConnectorMeaning(expr);
    
    return explanation;
  }
  
  private generateLogicSteps(expr: string, vars: string[], table: any[]): string[] {
    const steps: string[] = [];
    const connectors = this.identifyConnectors(expr);
    
    steps.push(`Expresion: ${expr}`);
    steps.push(`Variables: ${vars.join(', ')}`);
    steps.push(`Combinaciones totales: ${Math.pow(2, vars.length)}`);
    
    if (connectors.length > 0) {
      steps.push(`Conectores: ${connectors.map(c => c.symbol).join(', ')}`);
    }
    
    steps.push(`Tipo: ${table.every(r => r.result) ? 'Tautologia' : table.every(r => !r.result) ? 'Contradiccion' : 'Contingencia'}`);
    
    return steps;
  }
  
  private identifyConnectors(expr: string): { symbol: string; name: string; desc: string }[] {
    const result: { symbol: string; name: string; desc: string }[] = [];
    
    if (expr.includes('¬')) result.push({ symbol: '¬', name: 'Negacion', desc: 'Invierte el valor de verdad' });
    if (expr.includes('∧')) result.push({ symbol: '∧', name: 'Conjuncion', desc: 'Verdadera solo si ambas son verdaderas' });
    if (expr.includes('∨')) result.push({ symbol: '∨', name: 'Disyuncion', desc: 'Falsa solo si ambas son falsas' });
    if (expr.includes('→')) result.push({ symbol: '→', name: 'Implicacion', desc: 'Falsa solo si antecedente verdadero y consecuente falso' });
    if (expr.includes('↔')) result.push({ symbol: '↔', name: 'Bicondicional', desc: 'Verdadera si ambas tienen el mismo valor' });
    
    return result;
  }
  
  private getConnectorMeaning(expr: string): string {
    let meaning = 'Significado de los conectores:\n\n';
    
    if (expr.includes('∧')) {
      meaning += '∧ (Conjuncion/Y): "p AND q" es verdadero SOLO cuando ambos son verdaderos.\n';
    }
    if (expr.includes('∨')) {
      meaning += '∨ (Disyuncion/O): "p OR q" es falso SOLO cuando ambos son falsos.\n';
    }
    if (expr.includes('→')) {
      meaning += '→ (Implicacion): "p implica q" es falso SOLO cuando p es verdadero y q es falso.\n';
    }
    if (expr.includes('↔')) {
      meaning += '↔ (Equivalencia): "p si y solo si q" es verdadero cuando ambos tienen el mismo valor.\n';
    }
    if (expr.includes('¬')) {
      meaning += '¬ (Negacion): "NO p" invierte el valor de verdad.\n';
    }
    
    return meaning;
  }
  
  private generateLogicExercise(diff: string): AIResponse {
    const exercises = {
      'easy': {
        q: 'Calcula la tabla de verdad de: p ∧ q',
        answer: 'La tabla tiene 4 combinaciones. Resultado verdadero solo cuando p=V y q=V.'
      },
      'medium': {
        q: 'Identifica si (p → q) ∨ r es una tautologia',
        answer: 'Con 3 variables hay 8 combinaciones. No es tautologia porque depende de los valores.'
      },
      'hard': {
        q: 'Simplifica: ¬(p ∧ q) usando leyes de De Morgan',
        answer: '¬(p ∧ q) = ¬p ∨ ¬q. Las leyes de De Morgan dicen que la negacion de una conjuncion es la disyuncion de las negaciones.'
      }
    };
    
    const ex = exercises[diff as keyof typeof exercises] || exercises['easy'];
    
    return {
      text: `Ejercicio (${diff}):\n\n${ex.q}\n\nRespuesta:\n${ex.answer}`,
      confidence: 0.9
    };
  }
  
  private generateSetsExercise(diff: string): AIResponse {
    const exercises = {
      'easy': {
        q: 'Si A = {1, 2, 3} y B = {3, 4, 5}, calcula A ∪ B',
        answer: 'A ∪ B = {1, 2, 3, 4, 5} (todos los elementos de ambos)'
      },
      'medium': {
        q: 'Si U = {1,2,3,4,5}, A = {1,2,3}, cual es A?',
        answer: 'A = U - A = {4, 5}. El complemento contiene elementos del universal que no estan en A.'
      },
      'hard': {
        q: 'Verifica si {1,2} ⊆ {1,2,3} y si {1,4} ⊆ {1,2,3}',
        answer: '{1,2} ⊆ {1,2,3} es VERDADERO porque todos los elementos de {1,2} estan en {1,2,3}.\n{1,4} ⊆ {1,2,3} es FALSO porque 4 no esta en {1,2,3}.'
      }
    };
    
    const ex = exercises[diff as keyof typeof exercises] || exercises['easy'];
    
    return {
      text: `Ejercicio (${diff}):\n\n${ex.q}\n\nRespuesta:\n${ex.answer}`,
      confidence: 0.9
    };
  }
  
  private generateGraphExercise(diff: string): AIResponse {
    const exercises = {
      'easy': {
        q: 'En un grafo con nodos A-B-C (A→B, B→C), cual es el recorrido BFS desde A?',
        answer: 'BFS desde A: 1) Visitar A, 2) Agregar B a cola, 3) Visitar B, agregar C, 4) Visitar C.\nOrden: A → B → C'
      },
      'medium': {
        q: 'Explica por que DFS puede detectar ciclos en un grafo',
        answer: 'DFS marca nodos como visitados. Si llega a un nodo ya visitado, hay un ciclo. El backtracking permite explorar todas las ramas.'
      },
      'hard': {
        q: 'Cual es la complejidad de BFS y DFS? Cuando preferiras cada uno?',
        answer: 'Ambos tienen complejidad O(V + E) donde V=nodos y E=aristas.\n\nBFS: Mejor para encontrar caminos mas cortos, grafos no ponderados.\nDFS: Mejor para detectar ciclos, topological sort, componentes conectados.'
      }
    };
    
    const ex = exercises[diff as keyof typeof exercises] || exercises['easy'];
    
    return {
      text: `Ejercicio (${diff}):\n\n${ex.q}\n\nRespuesta:\n${ex.answer}`,
      confidence: 0.9
    };
  }
  
  private getPredefinedResponse(msg: string): AIResponse {
    const lower = msg.toLowerCase();
    
    // Logic related
    if (lower.includes('tautologia') || lower.includes('contradiction')) {
      return {
        text: 'Una TAUTOLOGIA es una proposicion que siempre es verdadera (todas V en la tabla).\n\nUna CONTRADICCION es siempre falsa (todas F).\n\nUna CONTINGENCIA depende de los valores de las variables.',
        confidence: 0.95
      };
    }
    
    if (lower.includes('tabla') && lower.includes('verdad')) {
      return {
        text: 'Las tablas de verdad muestran todas las combinaciones posibles de valores de verdad para una expresion.\n\nCon n variables, hay 2^n combinaciones.\n\nEjemplo con p, q (2 variables):\n- VV, VF, FV, FF (4 combinaciones)',
        confidence: 0.95
      };
    }
    
    if (lower.includes('implicacion') || lower.includes('→')) {
      return {
        text: 'La IMPLICACION (p → q) es falsa SOLO cuando p es verdadera Y q es falsa.\n\nPiensa en "si p entonces q".\n\nEjemplos:\n- "Si llueve, me mojo" - si llueve Y no me mojo, es mentira.',
        confidence: 0.95
      };
    }
    
    if (lower.includes('conjunto') || lower.includes('union')) {
      return {
        text: 'Operaciones basicas de conjuntos:\n\nUnion (U): Todos los elementos de A y B\nInterseccion (n): Solo elementos comunes\nDiferencia (-): Elementos de A que no estan en B\nComplemento (\'): Elementos del universal que no estan en A',
        confidence: 0.95
      };
    }
    
    if (lower.includes('bfs') || lower.includes('breadth')) {
      return {
        text: 'BFS (Breadth-First Search):\n\n1. Usa una COLA (FIFO)\n2. Explora nivel por nivel\n3. Primero vecinos directos, luego vecinos de vecinos\n4. Encuentra el camino mas corto en grafos no ponderados',
        confidence: 0.95
      };
    }
    
    if (lower.includes('dfs') || lower.includes('depth')) {
      return {
        text: 'DFS (Depth-First Search):\n\n1. Usa una PILA (LIFO)\n2. Explora lo mas profundo posible antes de retroceder\n3. Va hasta encontrar un callejon sin salida\n4. Ideal para detectar ciclos y topological sort',
        confidence: 0.95
      };
    }
    
    // Default response
    return {
      text: 'Soy tu tutor de estructuras discretas. Puedo ayudarte con:\n\n- Logica proposicional (tablas de verdad, conectores)\n- Teoria de conjuntos (union, interseccion, etc)\n- Grafos (BFS, DFS, algoritmos)\n\nPregunta algo especifico!',
      confidence: 0.7
    };
  }
  
  private async callOpenAI(msg: string): Promise<AIResponse> {
    // OpenAI API integration placeholder
    // Would need actual API key and backend proxy for this to work
    throw new Error('OpenAI not configured');
  }
  
  private genId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}