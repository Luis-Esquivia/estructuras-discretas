import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Types
type QuestionType = 'truth-table' | 'set-operation' | 'graph-traversal' | 'simplification';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  module: 'logic' | 'sets' | 'graphs';
}

interface QuizResult {
  questionId: string;
  userAnswer: number | null;
  correct: boolean;
  timeSpent: number;
}

interface QuizState {
  totalQuestions: number;
  currentQuestion: number;
  timeLimit: number;
  difficulty: Difficulty;
  module: 'logic' | 'sets' | 'graphs' | 'all';
  questions: Question[];
  answers: QuizResult[];
  score: number;
  startTime: number;
  currentQuestionStartTime: number;
  isActive: boolean;
  isFinished: boolean;
}

// Question Bank
const questionBank: Question[] = [
  // LOGIC - Truth Tables
  {
    id: 'logic-1',
    type: 'truth-table',
    difficulty: 'easy',
    module: 'logic',
    question: '¿Cuál es el valor de verdad de "p ∧ q" cuando p=V y q=F?',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 1,
    explanation: 'La conjunción (∧) es verdadera solo cuando ambas proposiciones son verdaderas. Como q es falso, el resultado es falso.'
  },
  {
    id: 'logic-2',
    type: 'truth-table',
    difficulty: 'easy',
    module: 'logic',
    question: '¿Cuál es el valor de verdad de "p ∨ q" cuando p=F y q=F?',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 1,
    explanation: 'La disyunción (∨) es falsa solo cuando ambas proposiciones son falsas.'
  },
  {
    id: 'logic-3',
    type: 'truth-table',
    difficulty: 'medium',
    module: 'logic',
    question: '¿Cuál es el valor de verdad de "p → q" cuando p=V y q=F?',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 1,
    explanation: 'El condicional (→) es falso solo cuando el antecedente es verdadero y el consecuente es falso.'
  },
  {
    id: 'logic-4',
    type: 'truth-table',
    difficulty: 'medium',
    module: 'logic',
    question: '¿Cuál es el valor de verdad de "¬p ∧ q" cuando p=V y q=V?',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 1,
    explanation: '¬p es falso (porque p es verdadero). Falso ∧ Verdadero = Falso.'
  },
  {
    id: 'logic-5',
    type: 'truth-table',
    difficulty: 'hard',
    module: 'logic',
    question: '¿La fórmula (p → q) ↔ (¬p ∨ q) es una...?',
    options: ['Tautología', 'Contradicción', 'Contingencia'],
    correctAnswer: 0,
    explanation: 'Esta es una equivalencia lógica fundamental. El condicional siempre es equivalente a ¬p ∨ q, por lo que es siempre verdadero (tautología).'
  },
  // LOGIC - Simplification
  {
    id: 'logic-6',
    type: 'simplification',
    difficulty: 'medium',
    module: 'logic',
    question: '¿A qué es equivalente ¬(p ∧ q) según la Ley de De Morgan?',
    options: ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∨ q'],
    correctAnswer: 1,
    explanation: 'Primera Ley de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q'
  },
  {
    id: 'logic-7',
    type: 'simplification',
    difficulty: 'medium',
    module: 'logic',
    question: '¿A qué es equivalente ¬(p ∨ q) según la Ley de De Morgan?',
    options: ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∧ q'],
    correctAnswer: 0,
    explanation: 'Segunda Ley de De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q'
  },
  {
    id: 'logic-8',
    type: 'simplification',
    difficulty: 'hard',
    module: 'logic',
    question: '¿A qué es equivalente p ∨ (p ∧ q)?',
    options: ['p', 'p ∧ q', 'q'],
    correctAnswer: 0,
    explanation: 'Ley de Absorción: p ∨ (p ∧ q) ≡ p'
  },
  // SETS - Operations
  {
    id: 'sets-1',
    type: 'set-operation',
    difficulty: 'easy',
    module: 'sets',
    question: 'Si A = {1, 2, 3} y B = {3, 4, 5}, ¿cuál es A ∪ B?',
    options: ['{1, 2, 3, 4, 5}', '{3}', '{1, 2, 3, 4, 5}'],
    correctAnswer: 0,
    explanation: 'La unión contiene todos los elementos de A y B sin duplicados: {1, 2, 3, 4, 5}'
  },
  {
    id: 'sets-2',
    type: 'set-operation',
    difficulty: 'easy',
    module: 'sets',
    question: 'Si A = {1, 2, 3} y B = {3, 4, 5}, ¿cuál es A ∩ B?',
    options: ['{3}', '{1, 2, 3, 4, 5}', '{1, 2, 4, 5}'],
    correctAnswer: 0,
    explanation: 'La intersección contiene solo los elementos comunes: {3}'
  },
  {
    id: 'sets-3',
    type: 'set-operation',
    difficulty: 'medium',
    module: 'sets',
    question: 'Si A = {1, 2, 3} y B = {3, 4, 5}, ¿cuál es A - B?',
    options: ['{1, 2}', '{3}', '{4, 5}'],
    correctAnswer: 0,
    explanation: 'La diferencia A - B contiene elementos de A que NO están en B: {1, 2}'
  },
  {
    id: 'sets-4',
    type: 'set-operation',
    difficulty: 'medium',
    module: 'sets',
    question: 'Si U = {1,2,3,4,5} y A = {1,2,3}, ¿cuál es A\' (complemento de A)?',
    options: ['{1, 2, 3}', '{4, 5}', '{1, 2, 3, 4, 5}'],
    correctAnswer: 1,
    explanation: 'El complemento de A contiene elementos de U que NO están en A: {4, 5}'
  },
  {
    id: 'sets-5',
    type: 'set-operation',
    difficulty: 'hard',
    module: 'sets',
    question: 'Si A = {1, 2, 3}, B = {3, 4, 5} y C = {5, 6}, ¿cuál es A Δ B (diferencia simétrica)?',
    options: ['{1, 2, 4, 5}', '{3}', '{1, 2, 3, 4, 5}'],
    correctAnswer: 0,
    explanation: 'La diferencia simétrica contiene elementos en A o B pero NO en ambos: {1, 2, 4, 5}'
  },
  // GRAPHS - BFS/DFS
  {
    id: 'graphs-1',
    type: 'graph-traversal',
    difficulty: 'easy',
    module: 'graphs',
    question: 'En BFS (Breadth-First Search), ¿qué estructura se usa para explorar nodos?',
    options: ['Stack (pila)', 'Queue (cola)', 'Heap'],
    correctAnswer: 1,
    explanation: 'BFS usa una cola (Queue) para explorar nodos por niveles - FIFO (First In, First Out).'
  },
  {
    id: 'graphs-2',
    type: 'graph-traversal',
    difficulty: 'easy',
    module: 'graphs',
    question: 'En DFS (Depth-First Search), ¿qué estructura se usa para explorar nodos?',
    options: ['Queue (cola)', 'Stack (pila)', 'Array'],
    correctAnswer: 1,
    explanation: 'DFS usa una pila (Stack) para explorar nodos en profundidad - LIFO (Last In, First Out).'
  },
  {
    id: 'graphs-3',
    type: 'graph-traversal',
    difficulty: 'medium',
    module: 'graphs',
    question: 'En un grafo con nodos A→B→C,Starting desde A con BFS, ¿en qué orden se visitan los nodos?',
    options: ['A, B, C', 'C, B, A', 'B, A, C'],
    correctAnswer: 0,
    explanation: 'BFS visita por niveles, luego en orden de descubrimiento: A primero, luego B, luego C.'
  },
  {
    id: 'graphs-4',
    type: 'graph-traversal',
    difficulty: 'medium',
    module: 'graphs',
    question: 'Un grafo tiene ciclo si y solo si...',
    options: ['Tiene más de 2 nodos', 'Hay un camino que empieza y termina en el mismo nodo', 'Es dirigido'],
    correctAnswer: 1,
    explanation: 'Un ciclo existe cuando hay un camino que parte de un nodo y regresa a ese mismo nodo.'
  },
  {
    id: 'graphs-5',
    type: 'graph-traversal',
    difficulty: 'hard',
    module: 'graphs',
    question: 'Si DFS visita nodos en orden A→B→C desde A, ¿cuál es la secuencia de visitados?',
    options: ['A, B, C', 'C, B, A', 'A, C, B'],
    correctAnswer: 0,
    explanation: 'DFS marca nodos cuando los visita por primera vez: A, luego su vecino B, luego el vecino de B que es C.'
  }
];

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  // Quiz Configuration
  showConfig = signal<boolean>(true);
  timeLimit = signal<number>(5);
  difficulty = signal<Difficulty>('medium');
  module = signal<'logic' | 'sets' | 'graphs' | 'all'>('all');
  totalQuestions = signal<number>(5);
  
  // Quiz State
  state = signal<QuizState | null>(null);
  
  // Timer
  private timerInterval: any;
  timeRemaining = signal<number>(0);
  
  // Computed
  currentQuestion = computed(() => this.state()?.questions[this.state()!.currentQuestion] || null);
  currentAnswer = computed(() => {
    const s = this.state();
    if (!s) return null;
    return s.answers[s.currentQuestion]?.userAnswer ?? null;
  });
  
  progress = computed(() => {
    const s = this.state();
    if (!s) return 0;
    return ((s.currentQuestion + 1) / s.totalQuestions) * 100;
  });
  
  score = computed(() => {
    const s = this.state();
    if (!s) return { correct: 0, total: 0, percentage: 0 };
    const correct = s.answers.filter(a => a.correct).length;
    return {
      correct,
      total: s.totalQuestions,
      percentage: Math.round((correct / s.totalQuestions) * 100)
    };
  });
  
  isLastQuestion = computed(() => {
    const s = this.state();
    return s ? s.currentQuestion === s.totalQuestions - 1 : true;
  });
  
  formatTime = computed(() => {
    const secs = this.timeRemaining();
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  });
  
  // Difficulty labels
  difficultyLabels: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil'
  };
  
  // Module labels
  moduleLabels: Record<string, string> = {
    logic: 'Lógica',
    sets: 'Conjuntos',
    graphs: 'Grafos',
    all: 'Todos'
  };
  
  startQuiz() {
    const filteredQuestions = this.getFilteredQuestions();
    const selectedQuestions = this.shuffleArray(filteredQuestions).slice(0, this.totalQuestions());
    
    const initialState: QuizState = {
      totalQuestions: this.totalQuestions(),
      currentQuestion: 0,
      timeLimit: this.timeLimit(),
      difficulty: this.difficulty(),
      module: this.module(),
      questions: selectedQuestions,
      answers: selectedQuestions.map(q => ({
        questionId: q.id,
        userAnswer: null,
        correct: false,
        timeSpent: 0
      })),
      score: 0,
      startTime: Date.now(),
      currentQuestionStartTime: Date.now(),
      isActive: true,
      isFinished: false
    };
    
    this.state.set(initialState);
    this.showConfig.set(false);
    this.timeRemaining.set(this.timeLimit() * 60 * this.totalQuestions());
    this.startTimer();
  }
  
  selectAnswer(index: number) {
    const s = this.state();
    if (!s || s.isFinished) return;
    
    const timeSpent = (Date.now() - s.currentQuestionStartTime) / 1000;
    const correct = index === s.questions[s.currentQuestion].correctAnswer;
    
    this.state.update(current => {
      if (!current) return current;
      const newAnswers = [...current.answers];
      newAnswers[current.currentQuestion] = {
        questionId: current.questions[current.currentQuestion].id,
        userAnswer: index,
        correct,
        timeSpent
      };
      return { ...current, answers: newAnswers };
    });
  }
  
  nextQuestion() {
    const s = this.state();
    if (!s) return;
    
    if (s.currentQuestion < s.totalQuestions - 1) {
      this.state.update(current => {
        if (!current) return current;
        return {
          ...current,
          currentQuestion: current.currentQuestion + 1,
          currentQuestionStartTime: Date.now()
        };
      });
    } else {
      this.finishQuiz();
    }
  }
  
  prevQuestion() {
    const s = this.state();
    if (!s || s.currentQuestion === 0) return;
    
    this.state.update(current => {
      if (!current) return current;
      return {
        ...current,
        currentQuestion: current.currentQuestion - 1
      };
    });
  }
  
  finishQuiz() {
    this.stopTimer();
    this.state.update(current => {
      if (!current) return current;
      return { ...current, isFinished: true };
    });
  }
  
  restartQuiz() {
    this.stopTimer();
    this.state.set(null);
    this.showConfig.set(true);
  }
  
  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining.update(t => {
        if (t <= 1) {
          this.finishQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }
  
  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  private getFilteredQuestions(): Question[] {
    const diff = this.difficulty();
    const mod = this.module();
    
    return questionBank.filter(q => {
      const diffMatch = q.difficulty === diff;
      const modMatch = mod === 'all' || q.module === mod;
      return diffMatch && modMatch;
    });
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  getScoreColor(): string {
    const pct = this.score().percentage;
    if (pct >= 80) return 'excellent';
    if (pct >= 60) return 'good';
    return 'needs-improvement';
  }
  
  getOptionClass(index: number): string {
    const s = this.state();
    if (!s || !s.isFinished) {
      const selected = this.currentAnswer();
      return selected === index ? 'selected' : '';
    }
    
    const correctAnswer = s.questions[s.currentQuestion].correctAnswer;
    if (index === correctAnswer) return 'correct';
    if (index === s.answers[s.currentQuestion].userAnswer && index !== correctAnswer) return 'incorrect';
    return '';
  }
  
  getAnswer(index: number) {
    const s = this.state();
    return s?.answers[index];
  }
  
  getIsAnswered(index: number): boolean {
    const s = this.state();
    return s?.answers[index]?.userAnswer !== null;
  }
}
