import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-message-input",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./message-input.component.html",
  styleUrls: ["./message-input.component.css"]
})
export class MessageInputComponent {
  @Output() messageSent = new EventEmitter<string>();
  messageContent = "";

  sendMessage(): void {
    if (this.messageContent.trim()) {
      this.messageSent.emit(this.messageContent);
      this.messageContent = "";
    }
  }
}
