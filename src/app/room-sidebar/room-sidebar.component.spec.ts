import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSidebarComponent } from './room-sidebar.component';

describe('RoomSidebarComponent', () => {
  let component: RoomSidebarComponent;
  let fixture: ComponentFixture<RoomSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
