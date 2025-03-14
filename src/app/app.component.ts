import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {ChatComponent} from './chat/chat.component';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ChatComponent],
  template: `
    <div class="chat-app">
      <app-chat></app-chat>
    </div>
  `,
})
export class AppComponent {}

