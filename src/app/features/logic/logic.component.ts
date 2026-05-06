import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Domain interfaces
interface TruthTableRow {
  values: Record<string, boolean>;
  result: boolean;
}

// Parser Híbrido - Lógica de negocio
class LogicParser {
  private varRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
  
  // Tokenizer
  private tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let buffer = '';
    
    for (const char of expr) {
      if (/\s/.test(char)) continue;
      
      if (/[a-zA-Z0-9]/.test(char)) {
        buffer += char;
      } else if (char === '¬' || char === '(' || char === ')') {
        if (buffer) { tokens.push(buffer); buffer = ''; }
        tokens.push(char);
      } else if (char === '∧' || char === '∨' || char === '→' || char === '↔') {
        if (buffer) { tokens.push(buffer); buffer = ''; }
        tokens.push(char);
      }
    }
    if (buffer) tokens.push(buffer);
    
    return tokens;
  }
  
  // Validar expresión
  validate(expr: string): { valid: boolean; error?: string } {
    if (!expr.trim()) {
      return { valid: false, error: 'Ingresa una expresión' };
    }
    
    const tokens = this.tokenize(expr);
    const parensStack: string[] = [];
    
    for (const token of tokens) {
      if (token === '(') {
        parensStack.push(token);
      } else if (token === ')') {
        if (parensStack.length === 0) {
          return { valid: false, error: 'Paréntesis no balanceados' };
        }
        parensStack.pop();
      } else if (!this.varRegex.test(token) && !'¬∧∨→↔()'.includes(token)) {
        return { valid: false, error: `Token inválido: ${token}` };
      }
    }
    
    if (parensStack.length > 0) {
      return { valid: false, error: 'Paréntesis no balanceados' };
    }
    
    return { valid: true };
  }
  
  // Extraer variables
  getVariables(expr: string): string[] {
    const tokens = this.tokenize(expr);
    const vars = new Set<string>();
    
    for (const token of tokens) {
      if (this.varRegex.test(token) && !'∧∨→↔'.includes(token)) {
        vars.add(token);
      }
    }
    
    return Array.from(vars).sort();
  }
  
  // Evaluar expresión
  evaluate(expr: string, values: Record<string, boolean>): boolean {
    // Simple shunt-yard algorithm
    const tokens = this.tokenize(expr);
    const opStack: string[] = [];
    const valStack: boolean[] = [];
    
    for (const token of tokens) {
      if (this.varRegex.test(token)) {
        valStack.push(values[token] ?? false);
      } else if (token === '¬') {
        if (valStack.length > 0) {
          const a = valStack.pop();
          valStack.push(!a);
        }
      } else if ('∧∨→↔'.includes(token)) {
        opStack.push(token);
      } else if (token === '(') {
        opStack.push(token);
      } else if (token === ')') {
        while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
          this.applyOp(opStack, valStack);
        }
        if (opStack.length > 0) opStack.pop();
      }
    }
    
    while (opStack.length > 0) {
      this.applyOp(opStack, valStack);
    }
    
    return valStack[0] ?? false;
  }
  
  private applyOp(ops: string[], vals: boolean[]) {
    if (vals.length < 2 || ops.length === 0) return;
    
    const op = ops.pop();
    if (!op || op === '(') return;
    
    const b = vals.pop()!;
    const a = vals.pop()!;
    
    let result: boolean;
    switch (op) {
      case '∧': result = a && b; break;
      case '∨': result = a || b; break;
      case '→': result = !a || b; break;
      case '↔': result = a === b; break;
      default: result = b;
    }
    
    vals.push(result);
  }
}

// Simplificador paso a paso
interface SimplificationStep {
  expression: string;
  rule: string;
  description: string;
}

class BooleanSimplifier {
  private rules: Array<{
    pattern: RegExp;
    replacement: (match: RegExpMatchArray) => string;
    rule: string;
    description: string;
  }>;

  constructor() {
    this.rules = [
      // Doble negación: ¬(¬p) = p
      {
        pattern: /¬\((¬)([a-zA-Z][a-zA-Z0-9]*)\)/g,
        replacement: (m) => m[2],
        rule: 'Doble negación',
        description: '¬(¬p) = p'
      },
      // De Morgan 1: ¬(p ∧ q) = ¬p ∨ ¬q
      {
        pattern: /¬\(([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*([a-zA-Z][a-zA-Z0-9]*)\)/g,
        replacement: (m) => `¬${m[1]} ∨ ¬${m[2]}`,
        rule: 'De Morgan',
        description: '¬(p ∧ q) = ¬p ∨ ¬q'
      },
      // De Morgan 2: ¬(p ∨ q) = ¬p ∧ ¬q
      {
        pattern: /¬\(([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*([a-zA-Z][a-zA-Z0-9]*)\)/g,
        replacement: (m) => `¬${m[1]} ∧ ¬${m[2]}`,
        rule: 'De Morgan',
        description: '¬(p ∨ q) = ¬p ∧ ¬q'
      },
      // Absorción 1: p ∨ (p ∧ q) = p
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*\(([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*[a-zA-Z][a-zA-Z0-9]*\)/g,
        replacement: (m) => m[1],
        rule: 'Absorción',
        description: 'p ∨ (p ∧ q) = p'
      },
      // Absorción 2: p ∧ (p ∨ q) = p
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*\(([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*[a-zA-Z][a-zA-Z0-9]*\)/g,
        replacement: (m) => m[1],
        rule: 'Absorción',
        description: 'p ∧ (p ∨ q) = p'
      },
      // Idempotencia 1: p ∧ p = p
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*\1/g,
        replacement: (m) => m[1],
        rule: 'Idempotencia',
        description: 'p ∧ p = p'
      },
      // Idempotencia 2: p ∨ p = p
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*\1/g,
        replacement: (m) => m[1],
        rule: 'Idempotencia',
        description: 'p ∨ p = p'
      },
      // Condicional: p → q = ¬p ∨ q
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*→\s*([a-zA-Z][a-zA-Z0-9]*)/g,
        replacement: (m) => `¬${m[1]} ∨ ${m[2]}`,
        rule: 'Condicional',
        description: 'p → q = ¬p ∨ q'
      },
      // Bicondicional: p ↔ q = (¬p ∨ q) ∧ (¬q ∨ p)
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*↔\s*([a-zA-Z][a-zA-Z0-9]*)/g,
        replacement: (m) => `(¬${m[1]} ∨ ${m[2]}) ∧ (¬${m[2]} ∨ ${m[1]})`,
        rule: 'Bicondicional',
        description: 'p ↔ q = (¬p ∨ q) ∧ (¬q ∨ p)'
      },
      // Neutralidad 1: p ∧ 1 = p (asumiendo 1 = tautología)
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*1/g,
        replacement: (m) => m[1],
        rule: 'Identidad',
        description: 'p ∧ 1 = p'
      },
      // Neutralidad 2: p ∨ 0 = p (asumiendo 0 = contradicción)
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*0/g,
        replacement: (m) => m[1],
        rule: 'Identidad',
        description: 'p ∨ 0 = p'
      },
      // Dominación 1: p ∨ 1 = 1
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*1/g,
        replacement: () => '1',
        rule: 'Dominación',
        description: 'p ∨ 1 = 1'
      },
      // Dominación 2: p ∧ 0 = 0
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*0/g,
        replacement: () => '0',
        rule: 'Dominación',
        description: 'p ∧ 0 = 0'
      },
      // Complemento 1: p ∨ ¬p = 1
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*¬\1/g,
        replacement: () => '1',
        rule: 'Complemento',
        description: 'p ∨ ¬p = 1 (Tercio Excluido)'
      },
      // Complemento 2: p ∧ ¬p = 0
      {
        pattern: /([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*¬\1/g,
        replacement: () => '0',
        rule: 'Complemento',
        description: 'p ∧ ¬p = 0 (Contradicción)'
      },
      // Asociativa: (p ∨ q) ∨ r = p ∨ q ∨ r
      {
        pattern: /\(([a-zA-Z][a-zA-Z0-9]*)\s*∨\s*([a-zA-Z][a-zA-Z0-9]*)\)\s*∨\s*([a-zA-Z][a-zA-Z0-9]*)/g,
        replacement: (m) => `${m[1]} ∨ ${m[2]} ∨ ${m[3]}`,
        rule: 'Asociativa',
        description: '(p ∨ q) ∨ r = p ∨ q ∨ r'
      },
      // Asociativa AND: (p ∧ q) ∧ r = p ∧ q ∧ r
      {
        pattern: /\(([a-zA-Z][a-zA-Z0-9]*)\s*∧\s*([a-zA-Z][a-zA-Z0-9]*)\)\s*∧\s*([a-zA-Z][a-zA-Z0-9]*)/g,
        replacement: (m) => `${m[1]} ∧ ${m[2]} ∧ ${m[3]}`,
        rule: 'Asociativa',
        description: '(p ∧ q) ∧ r = p ∧ q ∧ r'
      },
      // Eliminación paréntesis con ¬: ¬(p) = ¬p
      {
        pattern: /¬\(([a-zA-Z][a-zA-Z0-9]*)\)/g,
        replacement: (m) => `¬${m[1]}`,
        rule: 'Eliminación paréntesis',
        description: '¬(p) = ¬p'
      },
      // Eliminación paréntesis simples: (p) = p
      {
        pattern: /\(([a-zA-Z][a-zA-Z0-9]*)\)/g,
        replacement: (m) => m[1],
        rule: 'Eliminación paréntesis',
        description: '(p) = p'
      }
    ];
  }

  simplify(expr: string): SimplificationStep[] {
    const steps: SimplificationStep[] = [];
    let current = this.normalize(expr);
    let prev = '';
    let iterations = 0;
    const maxIterations = 50;

    steps.push({
      expression: current,
      rule: 'Inicial',
      description: 'Expresión original'
    });

    while (current !== prev && iterations < maxIterations) {
      prev = current;
      iterations++;
      
      let changed = false;
      
      for (const rule of this.rules) {
        const newExpr = current.replace(rule.pattern, (...args) => {
          const result = rule.replacement(args as RegExpMatchArray);
          return result;
        });
        
        if (newExpr !== current) {
          current = this.normalize(newExpr);
          steps.push({
            expression: current,
            rule: rule.rule,
            description: rule.description
          });
          changed = true;
          break;
        }
      }

      if (!changed) break;
    }

    if (current === prev && steps.length > 1) {
      steps.push({
        expression: current,
        rule: 'Forma canónica',
        description: 'No se pueden aplicar más reglas'
      });
    }

    return steps;
  }

  private normalize(expr: string): string {
    return expr
      .replace(/\s+/g, ' ')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*∧\s*/g, ' ∧ ')
      .replace(/\s*∨\s*/g, ' ∨ ')
      .replace(/\s*→\s*/g, ' → ')
      .replace(/\s*↔\s*/g, ' ↔ ')
      .trim();
  }
}

// Generador de Tablas
class TruthTableGenerator {
  generate(expr: string, variables: string[]): TruthTableRow[] {
    const rows: TruthTableRow[] = [];
    const parser = new LogicParser();
    const combinations = Math.pow(2, variables.length);
    
    for (let i = 0; i < combinations; i++) {
      const values: Record<string, boolean> = {};
      
      for (let j = 0; j < variables.length; j++) {
        const bit = (i >> (variables.length - 1 - j)) & 1;
        values[variables[j]] = bit === 1;
      }
      
      const result = parser.evaluate(expr, values);
      rows.push({ values, result });
    }
    
    return rows;
  }
}

// Componente Principal
@Component({
  selector: 'app-logic',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './logic.component.html',
  styleUrl: './logic.component.css'
})
export class LogicComponent {
  readonly expression = signal<string>('');
  readonly error = signal<string | null>(null);
  readonly showTable = signal<boolean>(false);
  readonly showSimplification = signal<boolean>(false);
  
  private parser = new LogicParser();
  private generator = new TruthTableGenerator();
  private simplifier = new BooleanSimplifier();
  
  readonly variables = computed(() => {
    const expr = this.expression();
    if (!expr) return [];
    return this.parser.getVariables(expr);
  });
  
  readonly table = computed(() => {
    if (!this.showTable()) return [];
    const expr = this.expression();
    const vars = this.variables();
    if (!expr || vars.length === 0 || vars.length > 5) return [];
    return this.generator.generate(expr, vars);
  });
  
  readonly classification = computed(() => {
    const tableData = this.table();
    if (tableData.length === 0) return null;
    
    const allTrue = tableData.every(r => r.result);
    const allFalse = tableData.every(r => !r.result);
    
    if (allTrue) return { type: 'Tautología', desc: 'Siempre verdadera' };
    if (allFalse) return { type: 'Contradicción', desc: 'Siempre falsa' };
    return { type: 'Contingencia', desc: 'Depende de los valores' };
  });
  
  readonly tooManyVars = computed(() => this.variables().length > 5);
  
  readonly simplificationSteps = computed(() => {
    const expr = this.expression();
    if (!expr || this.error()) return [];
    return this.simplifier.simplify(expr);
  });
  
  readonly operators = [
    { symbol: '¬', label: 'NOT' },
    { symbol: '∧', label: 'AND' },
    { symbol: '∨', label: 'OR' },
    { symbol: '→', label: '→' },
    { symbol: '↔', label: '↔' },
    { symbol: '(', label: '(' },
    { symbol: ')', label: ')' }
  ];
  
  insertOperator(op: string) {
    this.expression.update(e => e + op);
    this.validate();
  }
  
  clear() {
    this.expression.set('');
    this.error.set(null);
    this.showTable.set(false);
    this.showSimplification.set(false);
  }
  
  calculate() {
    this.validate();
    if (!this.error()) {
      this.showTable.set(true);
    }
  }
  
  simplify() {
    this.validate();
    if (!this.error()) {
      this.showSimplification.set(true);
    }
  }
  
  toggleSimplification() {
    this.showSimplification.update(v => !v);
  }
  
  validate() {
    const expr = this.expression();
    if (!expr) {
      this.error.set(null);
      return;
    }
    const result = this.parser.validate(expr);
    this.error.set(result.error ?? null);
  }
  
  setExample(expr: string) {
    this.expression.set(expr);
    this.validate();
  }
}