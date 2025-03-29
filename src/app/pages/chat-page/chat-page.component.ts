import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '../../service/chat-service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  conversations = [
    {id: 'test', name: 'Test Conversation'},
    {id: '2', name: 'Conversation 2'}
  ];
  selectedConversation = this.conversations[0];
  messages: any[] = [];
  newMessage = '';
  private messageSubscription?: Subscription;
  conversationId = this.selectedConversation.id;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.connect();
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.chatService.closeWebSocket();
  }

  connect(): void {
    this.chatService.connectWebSocket(this.conversationId);
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.messageSubscription = this.chatService.getNewMessages().subscribe(message => {
      if (message.conversationId === this.conversationId) {
        this.messages.push(message);
      }
    });
  }

  selectConversation(conv: any): void {
    this.selectedConversation = conv;
    this.conversationId = conv.id;
    this.messages = [];
    this.chatService.closeWebSocket();
    this.connect();
  }

  reconnect(): void {
    this.chatService.closeWebSocket();
    setTimeout(() => {
      this.connect();
    }, 500);
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        id: '',
        conversationId: this.conversationId,
        authorId: 'me',
        content: this.newMessage,
        timestamp: new Date()
      };
      this.chatService.sendMessageOverWebSocket(message);
      this.newMessage = '';
    }
  }
}
