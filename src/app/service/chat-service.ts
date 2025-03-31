import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Message} from "../model/message";
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    private wsUrl = environment.websocketUrl;
    private socket?: WebSocket;
    private messageSubject = new Subject<Message>();

    constructor(private http: HttpClient) {
    }

    connectWebSocket(conversationId: string): void {
        this.closeWebSocket();
        const token = localStorage.getItem("auth_token");
        const url = `${this.wsUrl}?conversationId=${conversationId}${token ? `&token=${token}` : ""}`;
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log("WebSocket connected:", conversationId);
        };
        this.socket.onmessage = event => {
            const message: Message = JSON.parse(event.data);
            this.messageSubject.next(message);
        };
        this.socket.onerror = error => {
            console.error("WebSocket error:", error);
        };
        this.socket.onclose = event => {
            console.log("WebSocket closed:", event);
        };
    }

    closeWebSocket(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    }

    sendMessageOverWebSocket(message: Message): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open. Cannot send message.");
        }
    }

    getNewMessages(): Observable<Message> {
        return this.messageSubject.asObservable();
    }

    deleteAllMessages(): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/chat/messages`);
    }
}
