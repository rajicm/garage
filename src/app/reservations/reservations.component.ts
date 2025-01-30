import { Component } from '@angular/core';
// import ParkingSpacesService from '../services/parking-spaces.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RESERVATIONS } from 'src/consts';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  // providers: [ParkingSpacesService],
})
export class ReservationsComponent {
  //   reservationDates = this.parkingService.getAllReservationDates();
  //   constructor(private readonly parkingService: ParkingSpacesService) {}
  //   onDeleteButton(index: number) {
  //     this.parkingService.findAndDeleteRecord(this.reservationDates[index]);
  //     this.reservationDates.splice(index);
  //   }
}
