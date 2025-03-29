import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Message} from "../model/message";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    private wsUrl = "ws://localhost:8080/ws/chat";
    private socket?: WebSocket;
    private messageSubject = new Subject<Message>();

    connectWebSocket(conversationId: string): void {
        this.closeWebSocket();
        this.socket = new WebSocket(`${this.wsUrl}?conversationId=${conversationId}`);
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
}
