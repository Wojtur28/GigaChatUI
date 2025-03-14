import { Component, EventEmitter, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-message-input",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="message-input">
      <input
        type="text"
        [(ngModel)]="messageContent"
        name="messageContent"
        placeholder="Type a message..."
        (keydown.enter)="$event.preventDefault(); sendMessage()"
      />
      <button
        type="button"
        [disabled]="!messageContent.trim()"
        (click)="sendMessage()">
        Send
      </button>
    </div>
  `,
})
export class MessageInputComponent {
  @Output() messageSent = new EventEmitter<string>()
  messageContent = ""

  sendMessage(): void {
    if (this.messageContent.trim()) {
      this.messageSent.emit(this.messageContent)
      this.messageContent = ""
    }
  }
}

