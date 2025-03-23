import { Injectable } from "@angular/core";
import { type Observable, Subject } from "rxjs";
import { webSocket, type WebSocketSubject } from "rxjs/webSocket";
import { Message } from "../model/message.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private apiUrl = "http://localhost:8080/chat";
  private wsUrl = "ws://localhost:8080/ws/chat";
  private wsConnection?: WebSocketSubject<Message>;
  private messageSubject = new Subject<Message>();
  private readonly roomId = "all";

  constructor(private http: HttpClient) {
    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    if (this.wsConnection) {
      console.log(`🔴 Zamykam poprzednie WebSocket dla ${this.roomId}`);
      this.wsConnection.unsubscribe();
    }

    console.log(`ℹ️ Otwieram nowe WebSocket dla ${this.roomId}`);
    this.wsConnection = webSocket<Message>({
      url: `${this.wsUrl}?roomId=${this.roomId}`,
      deserializer: msg => JSON.parse(msg.data),
    });

    this.wsConnection.subscribe({
      next: (message) => {
        console.log("📩 Otrzymano nową wiadomość przez WebSocket:", message);
        this.messageSubject.next(message);
      },
      error: (error) => {
        console.error("❌ Błąd WebSocket, ponowne połączenie za 5s:", error);
        setTimeout(() => this.connectWebSocket(), 5000);
      },
      complete: () => {
        console.warn("⚠️ Połączenie WebSocket zamknięte, ponowne łączenie...");
        this.connectWebSocket();
      }
    });
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/rooms/${this.roomId}/messages`);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, message);
  }

  getNewMessages(): Observable<Message> {
    return this.messageSubject.asObservable();
  }
}
