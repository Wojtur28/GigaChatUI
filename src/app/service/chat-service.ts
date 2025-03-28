import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Message} from "../model/message.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private apiUrl = "http://localhost:8080/chat";
  private wsUrl = "ws://localhost:8080/ws/chat";
  private socket?: WebSocket;
  private messageSubject = new Subject<Message>();

  constructor(private http: HttpClient) {
  }

  connectWebSocket(conversationId: string): void {
    this.closeWebSocket();

    this.socket = new WebSocket(`${this.wsUrl}?conversationId=${conversationId}`);

    this.socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      this.messageSubject.next(message);
    };

    this.socket.onerror = () => {
      setTimeout(() => this.connectWebSocket(conversationId), 5000);
    };

    this.socket.onclose = () => {
      setTimeout(() => this.connectWebSocket(conversationId), 5000);
    };
  }

  closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }

  getMessagesForRoom(conversationId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/rooms/${conversationId}/messages`);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, message);
  }

  getNewMessages(): Observable<Message> {
    return this.messageSubject.asObservable();
  }
}
