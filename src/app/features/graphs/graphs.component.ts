import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Domain interfaces
interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

interface TraversalStep {
  current: string;
  container: string[];  // queue for BFS, stack for DFS
  visited: string[];
  order: string[];
}

interface TraversalResult {
  type: 'bfs' | 'dfs';
  startNode: string;
  steps: TraversalStep[];
  finalOrder: string[];
}

// Graph Logic Service
class GraphLogic {
  // Create node
  createNode(label: string, x: number, y: number): GraphNode {
    return { id: this.genId(), label, x, y };
  }
  
  // Create edge
  createEdge(source: string, target: string): GraphEdge {
    return { id: this.genId(), source, target };
  }
  
  // Get adjacency list
  getAdjacencyList(nodes: GraphNode[], edges: GraphEdge[], directed: boolean): Map<string, string[]> {
    const adj = new Map<string, string[]>();
    
    nodes.forEach(n => adj.set(n.id, []));
    
    edges.forEach(e => {
      const sources = adj.get(e.source) || [];
      sources.push(e.target);
      adj.set(e.source, sources);
      
      if (!directed) {
        const targets = adj.get(e.target) || [];
        targets.push(e.source);
        adj.set(e.target, targets);
      }
    });
    
    return adj;
  }
  
  // BFS traversal
  bfs(nodes: GraphNode[], edges: GraphEdge[], directed: boolean, startId: string): TraversalResult {
    const adj = this.getAdjacencyList(nodes, edges, directed);
    const visited = new Set<string>();
    const queue: string[] = [startId];
    const steps: TraversalStep[] = [];
    const order: string[] = [];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      order.push(current);
      
      const neighbors = adj.get(current) || [];
      const toVisit = neighbors.filter(n => !visited.has(n));
      
      steps.push({
        current,
        container: [...queue],
        visited: [...visited],
        order: [...order]
      });
      
      queue.push(...toVisit);
    }
    
    return { type: 'bfs', startNode: startId, steps, finalOrder: order };
  }
  
  // DFS traversal
  dfs(nodes: GraphNode[], edges: GraphEdge[], directed: boolean, startId: string): TraversalResult {
    const adj = this.getAdjacencyList(nodes, edges, directed);
    const visited = new Set<string>();
    const stack: string[] = [startId];
    const steps: TraversalStep[] = [];
    const order: string[] = [];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      order.push(current);
      
      const neighbors = adj.get(current) || [];
      const toVisit = neighbors.filter(n => !visited.has(n)).reverse();
      
      steps.push({
        current,
        container: [...stack],
        visited: [...visited],
        order: [...order]
      });
      
      stack.push(...toVisit);
    }
    
    return { type: 'dfs', startNode: startId, steps, finalOrder: order };
  }
  
  private genId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

// Component
@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.css'
})
export class GraphsComponent {
  private logic = new GraphLogic();
  
  // State
  nodes = signal<GraphNode[]>([]);
  edges = signal<GraphEdge[]>([]);
  directed = signal<boolean>(true);
  
  // Selection
  selectedNode = signal<string | null>(null);
  edgeMode = signal<boolean>(false);
  edgeSource = signal<string | null>(null);
  
  // Algorithm
  selectedAlgorithm = signal<'bfs' | 'dfs' | null>(null);
  startNode = signal<string | null>(null);
  traversalResult = signal<TraversalResult | null>(null);
  currentStep = signal<number>(0);
  isPlaying = signal<boolean>(false);
  
  // New node input
  newNodeLabel = signal<string>('');
  
  // SVG dimensions
  svgWidth = 500;
  svgHeight = 350;
  
  // Computed
  adjacencyList = computed(() => {
    return this.logic.getAdjacencyList(this.nodes(), this.edges(), this.directed());
  });
  
  currentStepData = computed(() => {
    const result = this.traversalResult();
    const step = this.currentStep();
    if (!result || step >= result.steps.length) return null;
    return result.steps[step];
  });
  
  // Node operations
  addNode() {
    const label = this.newNodeLabel().trim() || this.nextLabel();
    const existingLabels = this.nodes().map(n => n.label);
    let finalLabel = label;
    let counter = 1;
    while (existingLabels.includes(finalLabel)) {
      finalLabel = `${label}${counter}`;
      counter++;
    }
    
    const padding = 50;
    const x = padding + Math.random() * (this.svgWidth - padding * 2);
    const y = padding + Math.random() * (this.svgHeight - padding * 2);
    
    const node = this.logic.createNode(finalLabel, x, y);
    this.nodes.update(n => [...n, node]);
    this.newNodeLabel.set('');
    
    // Auto-select start node if first
    if (this.nodes().length === 1) {
      this.startNode.set(node.id);
    }
  }
  
  nextLabel(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[this.nodes().length % letters.length];
  }
  
  selectNode(id: string) {
    if (this.edgeMode()) {
      if (!this.edgeSource()) {
        this.edgeSource.set(id);
      } else if (this.edgeSource() !== id) {
        this.addEdge(this.edgeSource()!, id);
        this.edgeSource.set(null);
        this.edgeMode.set(false);
      }
    } else {
      this.selectedNode.set(id);
    }
  }
  
  deleteNode(id: string) {
    this.nodes.update(n => n.filter(node => node.id !== id));
    this.edges.update(e => e.filter(edge => edge.source !== id && edge.target !== id));
    if (this.selectedNode() === id) this.selectedNode.set(null);
    if (this.startNode() === id) this.startNode.set(this.nodes()[0]?.id || null);
    this.resetTraversal();
  }
  
  moveNode(id: string, x: number, y: number) {
    this.nodes.update(nodes => nodes.map(n => n.id === id ? { ...n, x, y } : n));
  }
  
  addEdge(source: string, target: string) {
    // Check if edge already exists
    const exists = this.edges().some(e => 
      (e.source === source && e.target === target) ||
      (!this.directed() && e.source === target && e.target === source)
    );
    if (exists) return;
    
    const edge = this.logic.createEdge(source, target);
    this.edges.update(e => [...e, edge]);
  }
  
  deleteEdge(id: string) {
    this.edges.update(e => e.filter(edge => edge.id !== id));
    this.resetTraversal();
  }
  
  toggleEdgeMode() {
    this.edgeMode.update(v => !v);
    this.edgeSource.set(null);
  }
  
  toggleDirected() {
    this.directed.update(v => !v);
    this.resetTraversal();
  }
  
  // Algorithm operations
  selectAlgorithm(type: 'bfs' | 'dfs') {
    this.selectedAlgorithm.set(type);
  }
  
  runTraversal() {
    const algo = this.selectedAlgorithm();
    const start = this.startNode();
    
    if (!algo || !start || this.nodes().length === 0) return;
    
    let result: TraversalResult;
    
    if (algo === 'bfs') {
      result = this.logic.bfs(this.nodes(), this.edges(), this.directed(), start);
    } else {
      result = this.logic.dfs(this.nodes(), this.edges(), this.directed(), start);
    }
    
    this.traversalResult.set(result);
    this.currentStep.set(0);
    this.isPlaying.set(true);
  }
  
  nextStep() {
    const result = this.traversalResult();
    if (!result) return;
    
    if (this.currentStep() < result.steps.length - 1) {
      this.currentStep.update(s => s + 1);
    } else {
      this.isPlaying.set(false);
    }
  }
  
  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }
  
  resetTraversal() {
    this.traversalResult.set(null);
    this.currentStep.set(0);
    this.isPlaying.set(false);
  }
  
  // Helpers
  getNodeById(id: string): GraphNode | undefined {
    return this.nodes().find(n => n.id === id);
  }
  
  formatAdjList(): string {
    const adj = this.adjacencyList();
    const lines: string[] = [];
    
    this.nodes().forEach(node => {
      const neighbors = adj.get(node.id) || [];
      lines.push(`${node.label} -> [${neighbors.map(nid => this.getNodeById(nid)?.label || '').join(', ')}]`);
    });
    
    return lines.join('\n');
  }
  
  getEdgePath(edge: GraphEdge): string {
    const source = this.getNodeById(edge.source);
    const target = this.getNodeById(edge.target);
    if (!source || !target) return '';
    
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 22;
    
    const startX = source.x + (dx / dist) * radius;
    const startY = source.y + (dy / dist) * radius;
    const endX = target.x - (dx / dist) * radius;
    const endY = target.y - (dy / dist) * radius;
    
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }
  
  isNodeVisited(nodeId: string): boolean {
    const step = this.currentStepData();
    return step?.visited.includes(nodeId) || false;
  }
  
  isNodeCurrent(nodeId: string): boolean {
    const step = this.currentStepData();
    return step?.current === nodeId;
  }
  
  isEdgeTraversed(source: string, target: string): boolean {
    const step = this.currentStepData();
    if (!step) return false;
    
    const idx = step.order.indexOf(step.current);
    if (idx <= 0) return false;
    
    const prev = step.order[idx - 1];
    return (prev === source && step.current === target);
  }
  
  getArrowPoints(edge: GraphEdge): string {
    const source = this.getNodeById(edge.source);
    const target = this.getNodeById(edge.target);
    if (!source || !target) return '';
    
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 22;
    const arrowSize = 8;
    
    const tipX = target.x - (dx / dist) * radius;
    const tipY = target.y - (dy / dist) * radius;
    
    const angle = Math.atan2(dy, dx);
    const ax1 = tipX - arrowSize * Math.cos(angle - Math.PI / 6);
    const ay1 = tipY - arrowSize * Math.sin(angle - Math.PI / 6);
    const ax2 = tipX - arrowSize * Math.cos(angle + Math.PI / 6);
    const ay2 = tipY - arrowSize * Math.sin(angle + Math.PI / 6);
    
    return `${tipX},${tipY} ${ax1},${ay1} ${ax2},${ay2}`;
  }
  
  getOrderString(): string {
    const result = this.traversalResult();
    if (!result) return '';
    return result.finalOrder.map(id => this.getNodeById(id)?.label || '').join(' → ');
  }
  
  clearAll() {
    this.nodes.set([]);
    this.edges.set([]);
    this.selectedNode.set(null);
    this.resetTraversal();
  }
  
  loadExample() {
    this.clearAll();
    
    const a = this.logic.createNode('A', 100, 100);
    const b = this.logic.createNode('B', 250, 60);
    const c = this.logic.createNode('C', 400, 100);
    const d = this.logic.createNode('D', 100, 250);
    const e = this.logic.createNode('E', 250, 200);
    const f = this.logic.createNode('F', 400, 250);
    
    this.nodes.set([a, b, c, d, e, f]);
    
    this.edges.set([
      this.logic.createEdge(a.id, b.id),
      this.logic.createEdge(b.id, c.id),
      this.logic.createEdge(a.id, d.id),
      this.logic.createEdge(a.id, e.id),
      this.logic.createEdge(b.id, e.id),
      this.logic.createEdge(e.id, f.id),
      this.logic.createEdge(d.id, e.id),
    ]);
    
    this.startNode.set(a.id);
  }
}