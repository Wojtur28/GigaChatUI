import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Message } from "../model/message.model";

@Component({
  selector: "app-message-item",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./message-item.component.html",
  styleUrls: ["./message-item.component.css"]
})
export class MessageItemComponent {
  @Input() message!: Message;
  @Input() isOwnMessage = false;

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}
