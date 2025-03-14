import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import {Message} from '../model/message.model';

@Component({
  selector: "app-message-item",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message-item">
      <div class="message-bubble" [ngClass]="isOwnMessage ? 'own' : 'other'">
        <div class="message-meta">
          <span class="message-sender">{{ message.sender }}</span>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
        <p>{{ message.content }}</p>
      </div>
    </div>
  `,
})
export class MessageItemComponent {
  @Input() message!: Message
  @Input() isOwnMessage = false

  formatTime(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
}

