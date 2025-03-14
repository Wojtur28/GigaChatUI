import { Component, type OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MessageListComponent } from "../message-list/message-list.component";
import { MessageInputComponent } from "../message-input/message-input.component";
import { RoomSidebarComponent } from "../room-sidebar/room-sidebar.component";
import { Message } from "../model/message.model";
import { ChatService } from "../service/chat.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, FormsModule, MessageListComponent, MessageInputComponent, RoomSidebarComponent],
  template: `
    <div class="chat-container">
      <app-room-sidebar
        [rooms]="rooms"
        [selectedRoomId]="selectedRoomId">
      </app-room-sidebar>

      <div class="main-content">
        <div class="chat-header">
          <h2 class="text-xl font-semibold">
            {{ selectedRoomName }}
          </h2>
        </div>

        <app-message-list
          [messages]="messages"
          [currentUser]="currentUser">
        </app-message-list>

        <app-message-input
          (messageSent)="sendMessage($event)">
        </app-message-input>
      </div>
    </div>
  `,
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  rooms: { id: string; name: string }[] = [
    { id: "general", name: "General" }
  ];
  selectedRoomId = "general";
  selectedRoomName = "General";
  currentUser: string = "User_" + Math.floor(Math.random() * 1000);
  private messageSubscription?: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.subscribeToMessages();
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }

  loadMessages(): void {
    this.chatService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error("Error loading messages:", error);
      },
    });
  }

  subscribeToMessages(): void {
    this.messageSubscription = this.chatService.getNewMessages().subscribe((message) => {
      this.messages = [...this.messages, message];
    });
  }

  sendMessage(content: string): void {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: "",
      roomId: this.selectedRoomId,
      sender: this.currentUser,
      content: content,
      timestamp: new Date().toISOString(),
    };

    this.messages = [...this.messages, newMessage];

    this.chatService.sendMessage(newMessage).subscribe({
      next: (sentMessage) => {
        console.log("Message sent successfully:", sentMessage);
      },
      error: (error) => {
        console.error("Error sending message:", error);
      },
    });
  }
}
