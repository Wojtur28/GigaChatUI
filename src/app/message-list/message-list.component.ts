import {
  Component,
  Input,
  type OnChanges,
  type SimpleChanges,
  type ElementRef,
  ViewChild,
  type AfterViewChecked,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { MessageItemComponent } from "../message-item/message-item.component"
import {Message} from '../model/message.model';

@Component({
  selector: "app-message-list",
  standalone: true,
  imports: [CommonModule, MessageItemComponent],
  template: `
    <div class="messages-container" #scrollContainer>
      <div class="message-list">
        <ng-container *ngIf="messages.length > 0; else emptyState">
          <app-message-item
            *ngFor="let message of messages"
            [message]="message"
            [isOwnMessage]="message.sender === currentUser">
          </app-message-item>
        </ng-container>

        <ng-template #emptyState>
          <div class="empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class MessageListComponent implements OnChanges, AfterViewChecked {
  @Input() messages: Message[] = []
  @Input() currentUser = ""
  @ViewChild("scrollContainer") private scrollContainer!: ElementRef

  private shouldScrollToBottom = true

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["messages"]) {
      this.shouldScrollToBottom = true
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom()
      this.shouldScrollToBottom = false
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
    } catch (err) {
      console.error("Error scrolling to bottom:", err)
    }
  }


}

