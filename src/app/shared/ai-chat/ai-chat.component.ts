import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../core/ai.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.css'
})
export class AIChatComponent {
  ai = inject(AIService);
  
  inputMessage = signal<string>('');
  isExpanded = signal<boolean>(false);
  
  async sendMessage() {
    const msg = this.inputMessage().trim();
    if (!msg) return;
    
    this.inputMessage.set('');
    await this.ai.chat(msg);
  }
  
  toggleExpanded() {
    this.isExpanded.update(v => !v);
  }
  
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}