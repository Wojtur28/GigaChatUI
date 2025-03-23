import { Component, type OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
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
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  selectedRoomId = "All";
  currentUser: string = "User_" + Math.floor(Math.random() * 1000);
  private messageSubscription?: Subscription;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) {}

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
      this.cdr.detectChanges();
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

    this.chatService.sendMessage(newMessage).subscribe({
      next: () => {
        console.log("Message sent successfully");
      },
      error: (error) => {
        console.error("Error sending message:", error);
      },
    });
  }

  updateUsername(newUsername: string): void {
    this.currentUser = newUsername.trim() || "Anonymous";
  }

  updateRoom(newRoomId: string): void {
    this.selectedRoomId = newRoomId.trim();
    this.loadMessages();
  }
}
