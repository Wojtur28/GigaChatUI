import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '../../../service/chat-service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {AuthService} from '../../../service/auth-service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './group-chat-page.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./group-chat-page.component.css']
})
export class GroupChatPageComponent implements OnInit, OnDestroy {
  conversations = [
    {id: 'test', name: 'Test Conversation'},
    {id: '2', name: 'Conversation 2'}
  ];
  selectedConversation = this.conversations[0];
  messages: any[] = [];
  newMessage = '';
  private messageSubscription?: Subscription;
  conversationId = this.selectedConversation.id;

  constructor(private chatService: ChatService, private authService: AuthService) {

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

  autoResize(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
    const maxHeight = lineHeight * 3;
    if (textarea.scrollHeight < maxHeight) {
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = maxHeight + 'px';
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }
    if (this.newMessage.length > 255) {
      alert('Message cannot exceed 255 characters');
      return;
    }

    const authorUsername = this.authService.getUsernameFromToken();

    const message = {
      id: '',
      conversationId: this.conversationId,
      authorId: authorUsername || 'Unknown',
      content: this.newMessage,
      timestamp: new Date()
    };

    this.chatService.sendMessageOverWebSocket(message);
    this.newMessage = '';
  }
}
