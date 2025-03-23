import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";

@Component({
  selector: "app-room-sidebar",
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: "./room-sidebar.component.html",
  styleUrls: ["./room-sidebar.component.css"]
})
export class RoomSidebarComponent {
  @Input() selectedRoomId = "";
  @Input() currentUser = "";
  @Output() roomChanged = new EventEmitter<string>();
  @Output() usernameChanged = new EventEmitter<string>();

  updateUsername(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.usernameChanged.emit(inputElement.value);
    }
  }

  updateRoom(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.roomChanged.emit(inputElement.value);
    }
  }
}
