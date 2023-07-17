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
import { Observable, Subscription } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Store, select } from '@ngrx/store';
import { UserState } from '../store/reducers/user.reducer';

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
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ParkingSpacesComponent implements OnInit {
  availableParkingSpaces: number = null!;
  availableSpacesSubscription!: Subscription;
  todayReservations: number = null!;
  parkedUser: boolean = false;
  parkedUserSubscription!: Subscription;
  reservation = new FormControl();
  reservationDate: string = '';
  todaysDate = new Date();

  users$: Observable<User>;

  constructor(
    private readonly parkingService: ParkingSpacesService,
    private readonly store: Store<UserState>
  ) {
    this.users$ = this.store.pipe(select('user'));
  }

  ngOnInit() {
    this.availableSpacesSubscription =
      this.parkingService.reservationsToday$.subscribe((value) => {
        this.todayReservations = value;
        this.availableParkingSpaces = 10 - value;
      });
    this.parkedUserSubscription = this.parkingService.parkedUser$.subscribe(
      (value) => {
        this.parkedUser = value;
      }
    );
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
    if (this.reservationDate != 'Invalid date') {
      this.parkingService.reserveParkingSpace(this.reservationDate);
    } else alert('Date is invalid.');
  }

  ngOnDestroy() {
    this.availableSpacesSubscription.unsubscribe();
    this.parkedUserSubscription.unsubscribe();
  }
}
