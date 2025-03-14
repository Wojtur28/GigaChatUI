import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component"

@Component({
  selector: "app-room-sidebar",
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Modern Chat</h1>
          <app-theme-toggle></app-theme-toggle>
        </div>
      </div>
      <div class="sidebar-content">
        <h3 class="font-medium mb-3">Rooms</h3>
        <div>
          <button
            *ngFor="let room of rooms"
            class="room-btn"
            [ngClass]="{'active': room.id === selectedRoomId}"
            (click)="selectRoom(room.id)">
            {{ room.name }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class RoomSidebarComponent {
  @Input() rooms: { id: string; name: string }[] = []
  @Input() selectedRoomId = ""
  @Output() roomSelected = new EventEmitter<string>()

  selectRoom(roomId: string) {
    console.log('Zmiana pokoju zablokowana. Aktualny pokój:', this.selectedRoomId);
  }
}

