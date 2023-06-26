import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSpacesComponent } from './parking-spaces.component';

describe('ParkingSpacesComponent', () => {
  let component: ParkingSpacesComponent;
  let fixture: ComponentFixture<ParkingSpacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParkingSpacesComponent]
    });
    fixture = TestBed.createComponent(ParkingSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
