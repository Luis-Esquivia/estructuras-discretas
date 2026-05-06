import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Domain
interface SetModel<T> {
  id: string;
  name: string;
  elements: T[];
  type: 'extension' | 'comprehension';
}

type SetOpType = 'union' | 'intersection' | 'difference' | 'symmetric-diff' | 'complement';

interface OpResult {
  type: SetOpType;
  name: string;
  symbol: string;
  elements: (string | number)[];
  cardinality: number;
}

interface VennRegion {
  label: string;
  elements: (string | number)[];
  inA: boolean;
  inB: boolean;
  shade: boolean;
}

// Paso de animación
interface AnimationStep {
  description: string;
  elements: (string | number)[];
  highlight: 'a' | 'b' | 'both' | 'none' | 'result';
  operation: string;
}

// Sets Logic Service
class SetLogic {
  createSet<T>(elements: T[]): SetModel<T> {
    return { id: this.genId(), name: '', elements: [...new Set(elements)], type: 'extension' };
  }
  
  createRange(min: number, max: number): SetModel<number> {
    const arr: number[] = [];
    for (let i = min; i <= max; i++) arr.push(i);
    return { id: this.genId(), name: '', elements: arr, type: 'comprehension' };
  }
  
  union<T>(a: SetModel<T>, b: SetModel<T>): SetModel<T> {
    return { id: this.genId(), name: '', elements: [...new Set([...a.elements, ...b.elements])], type: 'extension' };
  }
  
  intersection<T>(a: SetModel<T>, b: SetModel<T>): SetModel<T> {
    return { id: this.genId(), name: '', elements: a.elements.filter(e => b.elements.some(be => String(e) === String(be))), type: 'extension' };
  }
  
  difference<T>(a: SetModel<T>, b: SetModel<T>): SetModel<T> {
    return { id: this.genId(), name: '', elements: a.elements.filter(e => !b.elements.some(be => String(e) === String(be))), type: 'extension' };
  }
  
  symmetricDiff<T>(a: SetModel<T>, b: SetModel<T>): SetModel<T> {
    return this.union(this.difference(a, b), this.difference(b, a));
  }
  
  complement<T>(a: SetModel<T>, u: SetModel<T>): SetModel<T> {
    return this.difference(u, a);
  }
  
  private genId(): string { return Math.random().toString(36).substring(2, 9); }
}

// Component
@Component({
  selector: 'app-sets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sets.component.html',
  styleUrl: './sets.component.css'
})
export class SetsComponent {
  private logic = new SetLogic();
  
  sets = signal<SetModel<any>[]>([]);
  selectedA = signal<string | null>(null);
  selectedB = signal<string | null>(null);
  selectedOp = signal<SetOpType>('union');
  result = signal<OpResult | null>(null);
  newInput = signal<string>('');
  showModal = signal<boolean>(false);
  activeTab = signal<'ext' | 'range'>('ext');
  compMin = signal<number>(0);
  compMax = signal<number>(10);
  complementU = signal<string>('');
  errorMsg = signal<string | null>(null);
  
  // Animación paso a paso
  animationSteps = signal<AnimationStep[]>([]);
  currentStep = signal<number>(0);
  isAnimating = signal<boolean>(false);
  showStepByStep = signal<boolean>(false);
  
  operations = [
    { type: 'union' as SetOpType, symbol: 'U', label: 'Union' },
    { type: 'intersection' as SetOpType, symbol: 'n', label: 'Interseccion' },
    { type: 'difference' as SetOpType, symbol: '-', label: 'Diferencia' },
    { type: 'symmetric-diff' as SetOpType, symbol: 'DM', label: 'Dif. Sim.' },
    { type: 'complement' as SetOpType, symbol: "'", label: 'Complemento' }
  ];
  
  setA = computed(() => this.sets().find(s => s.id === this.selectedA()) || null);
  setB = computed(() => this.sets().find(s => s.id === this.selectedB()) || null);
  universal = computed(() => {
    const u = this.complementU();
    if (!u) return null;
    const elems = this.parseInput(u);
    return elems.length ? this.logic.createSet(elems) : null;
  });
  
  parseInput(inp: string): any[] {
    if (!inp.trim()) return [];
    return inp.split(/[,;]/).map(p => p.trim()).filter(p => p).map(p => {
      const n = Number(p);
      return isNaN(n) ? p : n;
    });
  }
  
  addSet() {
    const elems = this.parseInput(this.newInput());
    if (!elems.length) { this.errorMsg.set('Ingresa elementos'); return; }
    const s = this.logic.createSet(elems);
    s.name = this.nextName();
    this.sets.update(ss => [...ss, s]);
    this.newInput.set('');
    this.showModal.set(false);
    if (this.sets().length === 1) this.selectedA.set(s.id);
    this.errorMsg.set(null);
  }
  
  addRange() {
    if (this.compMin() > this.compMax()) { this.errorMsg.set('Min no puede ser mayor que Max'); return; }
    const s = this.logic.createRange(this.compMin(), this.compMax());
    s.name = this.nextName();
    this.sets.update(ss => [...ss, s]);
    this.showModal.set(false);
    if (this.sets().length === 1) this.selectedA.set(s.id);
    this.errorMsg.set(null);
  }
  
  nextName(): string {
    const used = this.sets().map(s => s.name);
    for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      if (!used.includes(c)) return c;
    }
    return 'S' + this.sets().length;
  }
  
  selectA(id: string) { this.selectedA.set(id); this.calc(); }
  selectB(id: string) { this.selectedB.set(id); this.calc(); }
  selectOp(op: SetOpType) { this.selectedOp.set(op); this.calc(); }
  deleteSet(id: string) {
    this.sets.update(s => s.filter(x => x.id !== id));
    if (this.selectedA() === id) this.selectedA.set(null);
    if (this.selectedB() === id) this.selectedB.set(null);
  }
  
  calc() {
    const a = this.setA();
    const b = this.setB();
    const op = this.selectedOp();
    if (!a) { this.result.set(null); return; }
    
    let res: SetModel<any>;
    let name = '', symbol = '';
    
    switch (op) {
      case 'union':
        if (!b) return;
        res = this.logic.union(a, b);
        name = `${a.name} U ${b.name}`;
        symbol = 'U';
        break;
      case 'intersection':
        if (!b) return;
        res = this.logic.intersection(a, b);
        name = `${a.name} n ${b.name}`;
        symbol = 'n';
        break;
      case 'difference':
        if (!b) return;
        res = this.logic.difference(a, b);
        name = `${a.name} - ${b.name}`;
        symbol = '-';
        break;
      case 'symmetric-diff':
        if (!b) return;
        res = this.logic.symmetricDiff(a, b);
        name = `${a.name} DM ${b.name}`;
        symbol = 'DM';
        break;
      case 'complement':
        const u = this.universal();
        if (!u) { this.errorMsg.set('Define universal'); return; }
        res = this.logic.complement(a, u);
        name = `${a.name}'`;
        symbol = "'";
        break;
    }
    
    this.errorMsg.set(null);
    this.result.set({ type: op, name, symbol, elements: res.elements, cardinality: res.elements.length });
  }
  
  formatSet(s: SetModel<any>): string {
    if (s.elements.length === 0) return 'O';
    if (s.elements.length <= 10) return `{${s.elements.join(', ')}}`;
    return `{${s.elements.slice(0, 8).join(', ')}, ...}`;
  }
  
  formatRes(): string {
    const r = this.result();
    if (!r || r.elements.length === 0) return 'O';
    if (r.elements.length <= 10) return `{${r.elements.join(', ')}}`;
    return `{${r.elements.slice(0, 8).join(', ')}, ...}`;
  }
  
  getSym(): string { return this.operations.find(o => o.type === this.selectedOp())?.symbol || ''; }
  
  quickA() { const s = this.logic.createSet([1,2,3]); s.name='A'; this.sets.update(x=>[...x,s]); this.selectedA.set(s.id); }
  quickB() { const s = this.logic.createSet([3,4,5]); s.name='B'; this.sets.update(x=>[...x,s]); this.selectedB.set(s.id); }
  quickC() { const s = this.logic.createSet(['a','b','c']); s.name='C'; this.sets.update(x=>[...x,s]); }
  
  clearAll() {
    this.sets.set([]);
    this.selectedA.set(null);
    this.selectedB.set(null);
    this.result.set(null);
    this.animationSteps.set([]);
    this.currentStep.set(0);
  }
  
  // ===== Animación paso a paso =====
  toggleStepByStep() {
    this.showStepByStep.update(v => !v);
    if (this.showStepByStep()) {
      this.generateAnimationSteps();
    }
  }
  
  generateAnimationSteps() {
    const a = this.setA();
    const b = this.setB();
    const op = this.selectedOp();
    const steps: AnimationStep[] = [];
    
    if (!a) return;
    
    // Paso 1: Mostrar conjunto A
    steps.push({
      description: `Conjunto A tiene ${a.elements.length} elemento${a.elements.length !== 1 ? 's' : ''}`,
      elements: a.elements,
      highlight: 'a',
      operation: 'A'
    });
    
    // Solo para operaciones binarias, mostrar B
    if (b && op !== 'complement') {
      // Paso 2: Mostrar conjunto B
      steps.push({
        description: `Conjunto B tiene ${b.elements.length} elemento${b.elements.length !== 1 ? 's' : ''}`,
        elements: b.elements,
        highlight: 'b',
        operation: 'B'
      });
      
      // Paso 3: Explicar la operación
      const opDesc = this.getOpDescription(op);
      steps.push({
        description: opDesc,
        elements: [],
        highlight: 'none',
        operation: opDesc
      });
      
      // Pasos 4+: Mostrar cada elemento que pertenece al resultado
      const onlyA = a.elements.filter(e => !b.elements.some(be => String(e) === String(be)));
      const onlyB = b.elements.filter(e => !a.elements.some(ae => String(e) === String(ae)));
      const inBoth = a.elements.filter(e => b.elements.some(be => String(e) === String(be)));
      
      switch (op) {
        case 'union':
          if (onlyA.length > 0) {
            steps.push({
              description: `Elementos solo en A: ${onlyA.join(', ')}`,
              elements: onlyA,
              highlight: 'a',
              operation: 'A - B'
            });
          }
          if (onlyB.length > 0) {
            steps.push({
              description: `Elementos solo en B: ${onlyB.join(', ')}`,
              elements: onlyB,
              highlight: 'b',
              operation: 'B - A'
            });
          }
          if (inBoth.length > 0) {
            steps.push({
              description: `Elementos en A y B: ${inBoth.join(', ')}`,
              elements: inBoth,
              highlight: 'both',
              operation: 'A n B'
            });
          }
          break;
          
        case 'intersection':
          if (inBoth.length > 0) {
            steps.push({
              description: `Elementos comunes: ${inBoth.join(', ')}`,
              elements: inBoth,
              highlight: 'both',
              operation: 'A n B'
            });
          } else {
            steps.push({
              description: 'No hay elementos en común',
              elements: [],
              highlight: 'none',
              operation: 'Vacio'
            });
          }
          break;
          
        case 'difference':
          if (onlyA.length > 0) {
            steps.push({
              description: `Elementos en A pero no en B: ${onlyA.join(', ')}`,
              elements: onlyA,
              highlight: 'a',
              operation: 'A - B'
            });
          }
          break;
          
        case 'symmetric-diff':
          if (onlyA.length > 0) {
            steps.push({
              description: `Elementos solo en A: ${onlyA.join(', ')}`,
              elements: onlyA,
              highlight: 'a',
              operation: 'A - B'
            });
          }
          if (onlyB.length > 0) {
            steps.push({
              description: `Elementos solo en B: ${onlyB.join(', ')}`,
              elements: onlyB,
              highlight: 'b',
              operation: 'B - A'
            });
          }
          break;
      }
    } else if (op === 'complement') {
      const u = this.universal();
      const opDesc = `Complemento de A respecto a U`;
      steps.push({
        description: opDesc,
        elements: [],
        highlight: 'none',
        operation: opDesc
      });
      
      if (u) {
        const complement = u.elements.filter(e => !a.elements.some(ae => String(e) === String(ae)));
        steps.push({
          description: `Elementos en U pero no en A: ${complement.join(', ')}`,
          elements: complement,
          highlight: 'none',
          operation: "A'"
        });
      }
    }
    
    // Paso final: Resultado
    const r = this.result();
    if (r) {
      steps.push({
        description: `Resultado final: {${r.elements.join(', ') || 'vacio'}} (${r.elements.length} elemento${r.elements.length !== 1 ? 's' : ''})`,
        elements: r.elements,
        highlight: 'result',
        operation: r.name
      });
    }
    
    this.animationSteps.set(steps);
    this.currentStep.set(0);
    this.isAnimating.set(false);
  }
  
  private getOpDescription(op: SetOpType): string {
    switch (op) {
      case 'union': return 'Union: elementos en A o en B (o ambos)';
      case 'intersection': return 'Interseccion: elementos en A Y en B';
      case 'difference': return 'Diferencia: elementos en A pero no en B';
      case 'symmetric-diff': return 'Diferencia Simetrica: elementos en A o B pero no en ambos';
      case 'complement': return 'Complemento: elementos fuera de A';
      default: return '';
    }
  }
  
  nextStep() {
    if (this.currentStep() < this.animationSteps().length - 1) {
      this.currentStep.update(s => s + 1);
    }
  }
  
  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }
  
  playAnimation() {
    this.isAnimating.set(true);
    this.currentStep.set(0);
    this.animateNext();
  }
  
  private animateNext() {
    if (!this.isAnimating()) return;
    
    if (this.currentStep() < this.animationSteps().length - 1) {
      setTimeout(() => {
        this.currentStep.update(s => s + 1);
        this.animateNext();
      }, 1500);
    } else {
      this.isAnimating.set(false);
    }
  }
  
  stopAnimation() {
    this.isAnimating.set(false);
  }
  
  resetAnimation() {
    this.stopAnimation();
    this.currentStep.set(0);
  }
  
  currentStepData = computed(() => {
    const steps = this.animationSteps();
    const idx = this.currentStep();
    return steps[idx] || null;
  });
  
  getHighlightClass = computed(() => {
    if (!this.showStepByStep()) return 'none';
    const stepData = this.currentStepData();
    return stepData?.highlight || 'none';
  });
  
  getShaded(): VennRegion[] {
    const a = this.setA();
    const b = this.setB();
    const op = this.selectedOp();
    if (!a || (op !== 'complement' && !b)) return [];
    
    const all = new Set([...a.elements, ...(b?.elements || [])]);
    const regions: VennRegion[] = [];
    
    for (const elem of all) {
      const inA = a.elements.some(e => String(e) === String(elem));
      const inB = b ? b.elements.some(e => String(e) === String(elem)) : false;
      
      let shade = false;
      switch (op) {
        case 'union': shade = inA || inB; break;
        case 'intersection': shade = inA && inB; break;
        case 'difference': shade = inA && !inB; break;
        case 'symmetric-diff': shade = (inA || inB) && !(inA && inB); break;
        case 'complement': shade = !inA; break;
      }
      
      if (shade) regions.push({ label: String(elem), elements: [elem], inA, inB, shade });
    }
    return regions;
  }
}