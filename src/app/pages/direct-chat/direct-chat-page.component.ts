import {Message} from '../../model/message.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {ChatService} from '../../service/chat-service';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat-page.component.html',
  styleUrls: ['./direct-chat-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule
  ]
})
export class DirectChatPageComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  messageForm: FormGroup;
  private newMessageSubscription?: Subscription;
  currentUser = 'You';
  recipient = 'John Doe';
  conversationId: string = '';

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId') || '';

    if (this.conversationId) {
      this.chatService.connectWebSocket(this.conversationId);
      this.chatService.getMessagesForRoom(this.conversationId).subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
      });

      this.newMessageSubscription = this.chatService.getNewMessages().subscribe(message => {
        this.messages.push(message);
        this.scrollToBottom();
      });
    }
  }

  ngOnDestroy(): void {
    this.chatService.closeWebSocket();
    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }
  }

  sendMessage(): void {
    if (this.messageForm.valid) {
      const content = this.messageForm.value.content;

      const message: Message = {
        id: '',
        conversationId: this.conversationId,
        authorId: this.currentUser,
        content: content,
        timestamp: new Date().toISOString()
      };

      this.chatService.sendMessage(message).subscribe(() => {
        this.messageForm.reset();
      });
    }
  }

  isCurrentUserMessage(message: Message): boolean {
    return message.authorId === this.currentUser;
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}
