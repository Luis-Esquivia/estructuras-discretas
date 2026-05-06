import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type TutorialModule = 'logic' | 'sets' | 'graphs';
type TutorialType = 'truth-table' | 'simplification' | 'set-op' | 'bfs' | 'dfs';

interface TutorialStep {
  title: string;
  content: string;
  highlight?: string[];
  hint?: string;
}

interface Tutorial {
  id: string;
  module: TutorialModule;
  type: TutorialType;
  title: string;
  description: string;
  problem: string;
  steps: TutorialStep[];
}

// Tutorial content
const tutorials: Tutorial[] = [
  {
    id: 'truth-table-basics',
    module: 'logic',
    type: 'truth-table',
    title: 'Tablas de Verdad - Fundamentos',
    description: 'Aprende a construir y evaluar tablas de verdad paso a paso',
    problem: 'Construir la tabla de verdad de: p ∧ (q ∨ r)',
    steps: [
      {
        title: 'Identificar las variables',
        content: 'Primero identificamos todas las variables en la expresión. En "p ∧ (q ∨ r)" tenemos 3 variables: p, q y r.',
        highlight: ['p', 'q', 'r']
      },
      {
        title: 'Determinar el número de combinaciones',
        content: 'Con n variables, hay 2^n combinaciones posibles. Con 3 variables: 2³ = 8 filas en la tabla.',
        hint: 'Cada variable puede ser V (verdadero) o F (falso)'
      },
      {
        title: 'Crear las columnas base',
        content: 'Creamos una columna para cada variable: p, q, r. Luego seguimos con las operaciones internas.',
        highlight: ['p', 'q', 'r']
      },
      {
        title: 'Evaluar la operación interna (q ∨ r)',
        content: 'Primero evaluamos q ∨ r. Usamos la regla: la disyunción es verdadera si al menos una es verdadera.',
        highlight: ['q ∨ r']
      },
      {
        title: 'Evaluar la operación final (p ∧ resultado)',
        content: 'Ahora evaluamos p ∧ (q ∨ r). La conjunción es verdadera solo cuando AMBAS son verdaderas.',
        highlight: ['p ∧ (q ∨ r)']
      },
      {
        title: 'Resultado final',
        content: 'La tabla está completa. Observa que el resultado es verdadero solo cuando p=V, y al menos una de q o r es verdadera.',
        highlight: ['p ∧ (q ∨ r)']
      }
    ]
  },
  {
    id: 'de-morgan',
    module: 'logic',
    type: 'simplification',
    title: 'Ley de De Morgan',
    description: 'Aprende a aplicar las leyes de De Morgan para simplificar expresiones',
    problem: 'Simplificar: ¬(p ∧ q) usando Ley de De Morgan',
    steps: [
      {
        title: 'Identificar la expresión',
        content: 'Tenemos ¬(p ∧ q) - una negación de una conjunción.',
        highlight: ['¬', 'p ∧ q']
      },
      {
        title: 'Recordar la ley',
        content: 'Primera Ley de De Morgan: ¬(A ∧ B) ≡ ¬A ∨ ¬B\n\n"La negación de una conjunción es la disyunción de las negaciones"',
        hint: 'Piensa en palabras: "No es cierto que p y q sean verdaderos" = "p es falso o q es falso"'
      },
      {
        title: 'Aplicar la transformación',
        content: 'Aplicamos la ley: ¬(p ∧ q) → ¬p ∨ ¬q\n\nCambiamos el AND por OR y negamos cada variable.',
        highlight: ['¬p ∨ ¬q']
      },
      {
        title: 'Verificar con tabla de verdad',
        content: 'Las tablas de verdad de ¬(p ∧ q) y ¬p ∨ ¬q son idénticas, confirmando la equivalencia.',
        hint: 'Ambas expresiones dan el mismo resultado para todos los valores de p y q'
      },
      {
        title: 'Resultado',
        content: '✓ ¬(p ∧ q) ≡ ¬p ∨ ¬q\n\nEsta equivalencia es fundamental para simplificar circuitos lógicos y fórmulas.',
        highlight: ['¬p ∨ ¬q']
      }
    ]
  },
  {
    id: 'set-union',
    module: 'sets',
    type: 'set-op',
    title: 'Operaciones con Conjuntos - Unión',
    description: 'Aprende a realizar operaciones de unión entre conjuntos',
    problem: 'Si A = {1, 2, 3} y B = {3, 4, 5}, encontrar A ∪ B',
    steps: [
      {
        title: 'Identificar los conjuntos',
        content: 'A = {1, 2, 3} tiene 3 elementos\nB = {3, 4, 5} tiene 3 elementos\nNota: el elemento 3 aparece en ambos.',
        highlight: ['A', 'B']
      },
      {
        title: 'Recordar la definición',
        content: 'A ∪ B (unión) contiene TODOS los elementos que están en A, en B, o en ambos.\n\nA ∪ B = {x | x ∈ A ∨ x ∈ B}',
        hint: 'La unión es "incluir todo" sin duplicados'
      },
      {
        title: 'Procesar elementos de A',
        content: 'Comenzamos con los elementos de A: {1, 2, 3}',
        highlight: ['{1, 2, 3}']
      },
      {
        title: 'Agregar elementos de B',
        content: 'Agregamos los elementos de B que no estén ya: 4, 5\nEl 3 ya está, no lo duplicamos.',
        highlight: ['4', '5']
      },
      {
        title: 'Resultado',
        content: 'A ∪ B = {1, 2, 3, 4, 5}\n\n10 elementos en total, sin duplicados.',
        highlight: ['{1, 2, 3, 4, 5}']
      }
    ]
  },
  {
    id: 'bfs-traversal',
    module: 'graphs',
    type: 'bfs',
    title: 'Recorrido BFS (Breadth-First Search)',
    description: 'Aprende a recorrer un grafo por niveles usando BFS',
    problem: 'Recorrer el siguiente grafo usando BFS desde el nodo A:\n\nA → B → C\na → d → e',
    steps: [
      {
        title: 'Entender BFS',
        content: 'BFS explora por NIVELES ( Breadth = anchura).\n\nEstructura: COLA (Queue) - Primero en entrar, primero en salir (FIFO).\n\n\nNivel 0: Nodo inicial\nNivel 1: Vecinos del inicial\nNivel 2: Vecinos de los vecinos del inicial',
        hint: 'Piensa en cómo se expande una onda en el agua'
      },
      {
        title: 'Inicializar',
        content: 'Empezamos con el nodo A en la cola.\nCola: [A]\nVisitados: []',
        highlight: ['A']
      },
      {
        title: 'Procesar A',
        content: 'Sacamos A de la cola, lo marcamos como visitado.\nAgregamos sus vecinos (B, D) a la cola.\n\nCola: [B, D]\nVisitados: [A]',
        highlight: ['A']
      },
      {
        title: 'Procesar B',
        content: 'Sacamos B de la cola, lo marcamos.\nAgregamos su vecino (C) que no esté visitado.\n\nCola: [D, C]\nVisitados: [A, B]',
        highlight: ['B']
      },
      {
        title: 'Procesar D',
        content: 'Sacamos D de la cola.\nSu vecino E no está visitado, lo agregamos.\n\nCola: [C, E]\nVisitados: [A, B, D]',
        highlight: ['D']
      },
      {
        title: 'Procesar C',
        content: 'Sacamos C. Sus vecinos ya están visitados, no agregamos nada.\n\nCola: [E]\nVisitados: [A, B, D, C]',
        highlight: ['C']
      },
      {
        title: 'Procesar E',
        content: 'Sacamos E. No tiene vecinos no visitados.\n\nCola: []\nVisitados: [A, B, D, C, E]',
        highlight: ['E']
      },
      {
        title: 'Resultado',
        content: 'Orden de visita BFS: A → B → D → C → E\n\nPrimero explora todos los nodos a distancia 1, luego a distancia 2, etc.',
        highlight: ['A → B → D → C → E']
      }
    ]
  },
  {
    id: 'dfs-traversal',
    module: 'graphs',
    type: 'dfs',
    title: 'Recorrido DFS (Depth-First Search)',
    description: 'Aprende a recorrer un grafo en profundidad usando DFS',
    problem: 'Recorrer el siguiente grafo usando DFS desde el nodo A:\n\nA → B → C\na → d → e',
    steps: [
      {
        title: 'Entender DFS',
        content: 'DFS explora en PROFUNDIDAD (Depth = profundidad).\n\nEstructura: PILA (Stack) - Último en entrar, primero en salir (LIFO).\n\nVa lo más profundo posible antes de retroceder.',
        hint: 'Piensa en explorar un laberinto: siempre gira donde puedas hasta que no haya salida'
      },
      {
        title: 'Inicializar',
        content: 'Empezamos con el nodo A en la pila.\nPila: [A]\nVisitados: []',
        highlight: ['A']
      },
      {
        title: 'Procesar A',
        content: 'Sacamos A de la pila, lo marcamos.\nAgregamos sus vecinos (B, D) a la pila.\n\nPila: [D, B]\nVisitados: [A]',
        highlight: ['A']
      },
      {
        title: 'Continuar por B',
        content: 'Sacamos B (último en entrar).\nAgregamos su vecino C.\n\nPila: [D, C]\nVisitados: [A, B]',
        highlight: ['B']
      },
      {
        title: 'Continuar por C',
        content: 'Sacamos C. No tiene vecinos no visitados.\n\nPila: [D]\nVisitados: [A, B, C]',
        highlight: ['C']
      },
      {
        title: 'Regresar a D',
        content: 'Sacamos D.\nAgregamos su vecino E.\n\nPila: [E]\nVisitados: [A, B, C, D]',
        highlight: ['D']
      },
      {
        title: 'Procesar E',
        content: 'Sacamos E. No tiene vecinos no visitados.\n\nPila: []\nVisitados: [A, B, C, D, E]',
        highlight: ['E']
      },
      {
        title: 'Resultado',
        content: 'Orden de visita DFS: A → B → C → D → E\n\nDFS va en profundidad antes de explorar otros caminos.',
        highlight: ['A → B → C → D → E']
      }
    ]
  }
];

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.css'
})
export class TutorialComponent {
  readonly tutorials = tutorials;
  
  // Selection state
  selectedModule = signal<TutorialModule | null>(null);
  selectedTutorial = signal<Tutorial | null>(null);
  currentStep = signal<number>(0);
  
  // Computed
  filteredTutorials = computed(() => {
    const module = this.selectedModule();
    if (!module) return tutorials;
    return tutorials.filter(t => t.module === module);
  });
  
  currentStepData = computed(() => {
    const tutorial = this.selectedTutorial();
    const step = this.currentStep();
    if (!tutorial) return null;
    return tutorial.steps[step] || null;
  });
  
  progress = computed(() => {
    const tutorial = this.selectedTutorial();
    const step = this.currentStep();
    if (!tutorial) return 0;
    return ((step + 1) / tutorial.steps.length) * 100;
  });
  
  isLastStep = computed(() => {
    const tutorial = this.selectedTutorial();
    const step = this.currentStep();
    return tutorial ? step === tutorial.steps.length - 1 : true;
  });
  
  isFirstStep = computed(() => this.currentStep() === 0);
  
  // Module selection
  selectModule(module: TutorialModule) {
    this.selectedModule.set(module);
    this.selectedTutorial.set(null);
    this.currentStep.set(0);
  }
  
  // Tutorial selection
  selectTutorial(tutorial: Tutorial) {
    this.selectedTutorial.set(tutorial);
    this.currentStep.set(0);
  }
  
  // Navigation
  nextStep() {
    const tutorial = this.selectedTutorial();
    if (!tutorial) return;
    if (this.currentStep() < tutorial.steps.length - 1) {
      this.currentStep.update(s => s + 1);
    }
  }
  
  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }
  
  goToStep(index: number) {
    this.currentStep.set(index);
  }
  
  restart() {
    this.currentStep.set(0);
  }
  
  backToList() {
    this.selectedTutorial.set(null);
    this.currentStep.set(0);
  }
  
  // Icons for modules
  moduleIcons: Record<TutorialModule, string> = {
    logic: '∧',
    sets: '∪',
    graphs: '●'
  };
  
  moduleLabels: Record<TutorialModule, string> = {
    logic: 'Lógica',
    sets: 'Conjuntos',
    graphs: 'Grafos'
  };
}
