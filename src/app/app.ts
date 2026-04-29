import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AIChatComponent } from './shared/ai-chat/ai-chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AIChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('estructuras-discretas');
  
  // Navigation items
  readonly navItems = [
    { path: '/logic', label: 'Lógica', icon: '∧', color: '#7C3AED' },
    { path: '/sets', label: 'Conjuntos', icon: '∪', color: '#EA580C' },
    { path: '/graphs', label: 'Grafos', icon: '●', color: '#0891B2' }
  ];
  
  readonly currentPath = signal('/logic');
}