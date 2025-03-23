import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageItemComponent } from "../message-item/message-item.component";
import { Message } from "../model/message.model";

@Component({
  selector: "app-message-list",
  standalone: true,
  imports: [CommonModule, MessageItemComponent],
  templateUrl: "./message-list.component.html",
  styleUrls: ["./message-list.component.css"]
})
export class MessageListComponent implements OnChanges, AfterViewChecked {
  @Input() messages: Message[] = [];
  @Input() currentUser = "";
  @ViewChild("scrollContainer") private scrollContainer!: ElementRef;

  private shouldScrollToBottom = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["messages"]) {
      this.shouldScrollToBottom = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error("Error scrolling to bottom:", err);
    }
  }
}
