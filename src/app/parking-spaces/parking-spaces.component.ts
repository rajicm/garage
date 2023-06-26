import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { MY_FORMATS } from 'src/consts';
import ParkingSpacesService from '../services/parking-spaces.service';

@Component({
  selector: 'app-parking-spaces',
  templateUrl: './parking-spaces.component.html',
  styleUrls: ['./parking-spaces.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatMomentDateModule,
  ],
  providers: [
    ParkingSpacesService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ParkingSpacesComponent implements OnInit {
  availableParkingSpaces: number = null!;
  todayReservations: number = null!;
  parkedUser: boolean = false;
  reservation = new FormControl();
  reservationDate: string = '';
  todaysDate = new Date();
  broj: number = null!;

  constructor(private readonly parkingService: ParkingSpacesService) {}

  ngOnInit() {
    this.parkingService.reservationsToday$.subscribe((value) => {
      this.todayReservations = value;
      this.availableParkingSpaces = 10 - value;
    });
    this.parkingService.parkedUser$.subscribe((value) => {
      this.parkedUser = value;
      console.log('user id ', this.parkedUser);
    });
  }

  decreeseAvailableParking() {
    this.availableParkingSpaces =
      this.parkingService.decreeseAvailableParking();
  }

  increeseAvailableParking() {
    this.availableParkingSpaces =
      this.parkingService.increeseAvailableParking();
  }

  reserveParkingSpace() {
    this.reservationDate = moment(this.reservation.value).format('DD-MM-YYYY');
    console.log(this.reservationDate);
    if (this.reservationDate != 'Invalid date') {
      this.parkingService.reserveParkingSpace(this.reservationDate);
    } else alert('Date is invalid.');
  }
}
