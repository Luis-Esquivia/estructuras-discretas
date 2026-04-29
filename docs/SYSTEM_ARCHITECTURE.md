# Arquitectura del Sistema

## Visión General

La aplicación sigue una **arquitectura basada en componentes** con Angular, aplicando principios de Clean Architecture para mantener separation of concerns y facilitar el mantenimiento.

```
┌─────────────────────────────────────────────────────┐
│                   Presentational                    │
│  (Componentes UI, Pipes, Directivas)                 │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  Application                         │
│  (Servicios, Stores, Casos de Uso)                  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                     Domain                         │
│  (Entidades, Lógica de Negocio, Interfaces)       │
└─────────────────────────────────────────────────────┘
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Configuración global
│   │   ├── config/             # Environments
│   │   └── services/            # Servicios singleton
│   ├── domain/                 # Lógica de negocio
│   │   ├── models/             # Interfaces y tipos
│   │   ├── logic/              # Algoritmos puros
│   │   └── interfaces/         # Contratos
│   ├── features/               # Módulos por funcionalidad
│   │   ├── logic/             # Lógica proposicional
│   │   ├── sets/              # Conjuntos
│   │   └── graphs/           # Grafos
│   ├── shared/                # Componentes reutilizables
│   │   ├── components/         # UI components
│   │   ├── pipes/             # Pipes personalizados
│   │   └── directives/      # Directivas
│   └── app.component.ts      # Root component
├── styles/                   # Estilos globales
└── assets/                   # Recursos estáticos
```

## Capas y Responsabilidades

### Presentational (Capa de Presentación)

Contiene todo lo relacionado con la UI:

- **Components**: Componentes Angular independientes
  - Smart components: Conectan con servicios/state
  - Dumb components: Solo Inputs/Outputs
  
- **Pipes**: Transformaciones de visualización
  - `TruthTableFormatPipe`: Formatea valores booleanos
  - `SetNotationPipe`: Notación de conjuntos
  - `GraphvizPipe`: Generador de DOT

- **Directivas**: Comportamientos reutilizables
  - `ClickOutsideDirective`: Detectar clicks fuera
  - `AutofocusDirective`: Enfocar elementos

### Application (Capa de Aplicación)

Servicios que orchestran la lógica:

- **LogicService**: Lógica proposicional
  - `parseExpression()`: Parser de expresiones
  - `generateTruthTable()`: Genera tabla de verdad
  - `evaluate()`: Evalúa expresión

- **SetService**: Teoría de conjuntos
  - `createSet()`: Crea conjuntos
  - `union()`, `intersection()`, etc: Operaciones

- **GraphService**: Grafos
  - `addNode()`, `addEdge()`: Manipulación
  - `bfs()`, `dfs()`: Algoritmos

- **AIService**: Integración con IA
  - `explain()`: Explica resultados
  - `generateExercise()`: Crea ejercicios

### Domain (Capa de Dominio)

Entidades y lógica pura:

- **Models/Interfaces**:
  ```typescript
  interface Proposition {
    expression: string;
    variables: string[];
    truthTable: boolean[][];
  }
  
  interface Set<T> {
    elements: T[];
    type: 'extension' | 'comprehension';
  }
  
  interface Graph {
    nodes: Node[];
    edges: Edge[];
    directed: boolean;
  }
  ```

- **Logic Puro**: Algoritmos en clases/utilities
  - `TruthTableGenerator`: Generación de tablas
  - `ExpressionEvaluator`: Evaluación
  - `BFSAlgorithm`, `DFSAlgorithm`

## Manejo de Estado

### Opción 1: Services con Signals (Recomendado para Angular 18+)

```typescript
@Injectable({ providedIn: 'root' })
export class LogicStateService {
  // Estado reactivo con signals
  readonly expression = signal<string>('');
  readonly variables = computed(() => extractVars(this.expression()));
  readonly truthTable = computed(() => generateTable(this.expression()));
}
```

### Opción 2: Signals + Componentes

```typescript
@Component({...})
export class LogicComponent {
  private state = inject(LogicStateService);
  
  // Computed reactivo
  table = this.state.truthTable;
}
```

## Comunicación entre Componentes

### Patrón Parent-Child
```typescript
// Parent
@Component({...})
export class ParentComponent {
  selectedItem = signal<Item | null>(null);
}

// Child
@Component({...})
export class ChildComponent {
  @Input() item!: Item;
  @Output() select = new EventEmitter<Item>();
}
```

### Patrón Servicio (Sibling)
```typescript
// Servicio compartido
@Injectable({ providedIn: 'root' })
export class SharedService {
  private selected = signal<Item | null>(null);
  readonly selection = this.selected.asReadonly();
}

// Componentes siblings
@Component({...})
export class SiblingAComponent {
  private service = inject(SharedService);
  selectItem(item: Item) {
    this.service.selection.set(item);
  }
}

@Component({...})
export class SiblingBComponent {
  private service = inject(SharedService);
  current = this.service.selection;
}
```

## Principios SOLID Aplicados

### Responsabilidad Única
- Cada servicio hace una cosa: `LogicService` solo lógica, `GraphService` solo grafos
- Componentes pequeños y enfocados

### Abierto/Cerrado
- Nuevos operadores lógicos: Extender el Parser, no modificarlo
- Nuevos tipos de grafos: Nueva clase, misma interfaz

### Inyección de Dependencias
- Servicios inyectables
- Facilita testing con mocks

## Testing Strategy

- **Unit Tests**: Lógica pura en domain/
- **Component Tests**: Comportamiento de componentes
- **Integration Tests**: Flujos completos
- **E2E**: Navegación y flujos de usuario