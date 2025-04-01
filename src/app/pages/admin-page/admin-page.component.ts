import {Component, type OnInit} from "@angular/core"
import {ChatService} from "../../service/chat-service"
import {HttpClient} from "@angular/common/http"
import {environment} from "../../../environments/environment.prod";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

interface User {
    id: string
    username: string
    email: string
    isBlocked: boolean
    isShadowBanned: boolean
    lastActive: Date
}

@Component({
    selector: "app-admin-page",
    templateUrl: "./admin-page.component.html",
    styleUrls: ["./admin-page.component.css"],
    imports: [
        DatePipe,
        NgForOf,
        NgIf
    ]
})
export class AdminPageComponent implements OnInit {
    users: User[] = []
    selectedUser: User | null = null
    showDetailsModal = false

    constructor(
        private chatService: ChatService,
        private http: HttpClient,
    ) {
    }

    ngOnInit() {
        this.loadUsers()
    }

    loadUsers() {
        this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
            next: (data) => {
                this.users = data
            },
            error: (err) => {
                console.error("Error loading users:", err)
                alert("Failed to load users")
            },
        })
    }

    blockUser(userId: string) {
        this.http.post(`${environment.apiUrl}/users/${userId}/block`, {}).subscribe({
            next: () => {
                this.users = this.users.map((user) => (user.id === userId ? {...user, isBlocked: true} : user))
                alert("User blocked successfully")
            },
            error: (err) => {
                console.error("Error blocking user:", err)
                alert("Failed to block user")
            },
        })
    }

    unblockUser(userId: string) {
        this.http.post(`${environment.apiUrl}/users/${userId}/unblock`, {}).subscribe({
            next: () => {
                this.users = this.users.map((user) => (user.id === userId ? {...user, isBlocked: false} : user))
                alert("User unblocked successfully")
            },
            error: (err) => {
                console.error("Error unblocking user:", err)
                alert("Failed to unblock user")
            },
        })
    }

    shadowbanUser(userId: string) {
        this.http.post(`${environment.apiUrl}/users/${userId}/shadowban`, {}).subscribe({
            next: () => {
                this.users = this.users.map((user) => (user.id === userId ? {...user, isShadowBanned: true} : user))
                alert("User shadowbanned successfully")
            },
            error: (err) => {
                console.error("Error shadowbanning user:", err)
                alert("Failed to shadowban user")
            },
        })
    }

    removeShadowban(userId: string) {
        this.http.post(`${environment.apiUrl}/users/${userId}/remove-shadowban`, {}).subscribe({
            next: () => {
                this.users = this.users.map((user) => (user.id === userId ? {...user, isShadowBanned: false} : user))
                alert("Shadowban removed successfully")
            },
            error: (err) => {
                console.error("Error removing shadowban:", err)
                alert("Failed to remove shadowban")
            },
        })
    }

    deleteUser(userId: string) {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            this.http.delete(`${environment.apiUrl}/users/${userId}`).subscribe({
                next: () => {
                    this.users = this.users.filter((user) => user.id !== userId)
                    alert("User deleted successfully")
                },
                error: (err) => {
                    console.error("Error deleting user:", err)
                    alert("Failed to delete user")
                },
            })
        }
    }

    showDetails(user: User) {
        this.selectedUser = user
        this.showDetailsModal = true
    }

    closeDetails() {
        this.showDetailsModal = false
        this.selectedUser = null
    }

    deleteAll() {
        if (confirm("Are you sure you want to delete ALL messages? This action cannot be undone.")) {
            this.chatService.deleteAllMessages().subscribe({
                next: () => alert("All messages deleted successfully."),
                error: (err) => {
                    console.error("Error deleting messages:", err)
                    alert("Error deleting messages.")
                },
            })
        }
    }
}

