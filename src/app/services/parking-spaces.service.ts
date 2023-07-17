import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AVAILABLE_PARKING,
  RESERVATIONS,
  TODAY,
  USER_ID,
} from 'src/consts';

@Injectable()
export default class ParkingSpacesService {
  private reservationsTodaySubject = new BehaviorSubject<number>(0);
  reservationsToday$ = this.reservationsTodaySubject.asObservable();

  private parkedUserSubject = new BehaviorSubject<boolean>(false);
  parkedUser$ = this.parkedUserSubject.asObservable();

  private userReservedSubject = new BehaviorSubject<boolean>(false);
  userReserved$ = this.userReservedSubject.asObservable();

  private reservationCountSubject = new BehaviorSubject<number>(0);
  reservationCoun$ = this.reservationCountSubject.asObservable();

  reservations: string[] = [];
  userId: string = this.userService.getUserLoggedIn().uid;

  constructor(
    private dataBase: AngularFireDatabase,
    private readonly userService: UserService
  ) {
    this.setParkedUser();
    this.checkReservationsForToday();
  }

  ngOnInit() {}

  getSubjectValue(subject: BehaviorSubject<number>): number {
    subject.getValue();
    return subject.value;
  }

  areDatesEqual(date1: string, date2: string): boolean {
    return date1.valueOf() == date2.valueOf();
  }

  setParkedUser() {
    this.getRecords(RESERVATIONS, TODAY).subscribe((reservations) => {
      reservations.forEach((reservation: any) => {
        if (this.userId === reservation[USER_ID]) {
          this.parkedUserSubject.next(true);
        }
      });
    });
  }

  findUserInReservations(date: string) {
    this.getRecords(RESERVATIONS, date).subscribe((data) => {
      data.forEach((reservation: any) => {
        if (this.userId === reservation[USER_ID]) {
          this.userReservedSubject.next(true);
        }
      });
    });
  }

  saveReservation(dbName: string, key: string, value: string, message: string) {
    this.dataBase
      .list(dbName + '/' + [key])
      .push({ userId: value })
      .then(() => {
        alert('You ' + `${message}` + ' successfully!');
      })
      .catch(() => alert('An error occured. Please try again.'));
  }

  updatedRecord(dbName: string, key: string, value: number) {
    this.dataBase.object(dbName).set({ [key]: value });
  }

  getRecord(dbName: string): Observable<any> {
    return this.dataBase.object(dbName).valueChanges();
  }

  getRecords(dbName: string, date: string): Observable<any> {
    return this.dataBase.list(dbName + '/' + [date]).valueChanges();
  }

  getKeys(dbName: string): Observable<any> {
    return this.dataBase.list(dbName).snapshotChanges();
  }

  reservation(date: string, message: string) {
    this.saveReservation(RESERVATIONS, date, this.userId, message);
  }

  getReservationKeys(date: string) {
    this.reservations = [];
    this.getKeys(RESERVATIONS + `/${date}`).subscribe((data) => {
      data.forEach((d: any) => {
        this.reservations.push(d.key);
      });
    });
  }

  findAndDeleteRecord(date: string) {
    this.getReservationKeys(date);
    this.getRecords(RESERVATIONS, date).subscribe((reservations) => {
      let counter = 0;
      reservations.forEach((reservation: any) => {
        if (reservation[USER_ID] === this.userId) {
          this.deleteRecord(RESERVATIONS, date, this.reservations[counter]);
          return;
        }
        counter++;
      });
    });
  }

  deleteRecord(dbName: string, date: string, key?: string) {
    this.dataBase
      .list(dbName + '/' + [date])
      .remove(key)
      .catch(() => alert('An error occured. Please try again.'));
  }

  decreeseAvailableParking(): number {
    this.parkedUserSubject.next(true);
    this.reservation(TODAY, 'parked');
    return this.updateParkingAvailability(
      this.getSubjectValue(this.reservationsTodaySubject) + 1
    );
  }

  increeseAvailableParking(): number {
    this.parkedUserSubject.next(false);
    this.findAndDeleteRecord(TODAY);
    return this.updateParkingAvailability(
      this.getSubjectValue(this.reservationsTodaySubject) - 1
    );
  }

  updateParkingAvailability(reserved: number): number {
    this.reservationsTodaySubject.next(reserved);
    this.updatedRecord(AVAILABLE_PARKING, 'reservedParkingSpaces', reserved);
    return reserved;
  }

  checkReservationsForToday() {
    this.checkAvailability(TODAY);
  }

  reserveParkingSpace(date: string) {
    if (this.areDatesEqual(TODAY, date)) {
      if (
        this.getSubjectValue(this.reservationsTodaySubject) < 10 &&
        !this.parkedUserSubject.value
      ) {
        this.decreeseAvailableParking();
      } else {
        alert(
          'There are no available parking spaces or you are already parked!'
        );
      }
    } else {
      this.checkAvailability(date);
      console.log(
        'reservationCountSubject value ',
        this.getSubjectValue(this.reservationCountSubject)
      );
      if (
        this.getSubjectValue(this.reservationCountSubject) < 10 &&
        !this.userReservedSubject.value
      ) {
        this.reservation(date, 'reserved');
      } else {
        alert('There are no available parking spaces for selected date.');
      }
    }
  }

  checkAvailability(date: string) {
    this.getRecords(RESERVATIONS, date).subscribe((reservations) => {
      reservations.forEach(() => {
        this.findUserInReservations(date);
      });
      if (this.areDatesEqual(date, TODAY)) {
        this.updateParkingAvailability(reservations.length);
      } else {
        this.reservationCountSubject.next(reservations.length);
      }
    });
  }

  getAllReservationDates() {
    let reservationDates: any = [];
    this.getKeys(RESERVATIONS).subscribe((reservations) => {
      reservations.forEach((reservation: any) => {
        this.getRecords(RESERVATIONS, reservation.key).subscribe((records) => {
          records.forEach((record: any) => {
            if (
              record[USER_ID] === this.userId &&
              !reservationDates.includes(reservation.key)
            ) {
              reservationDates.push(reservation.key);
            }
          });
        });
      });
    });
    return reservationDates;
  }
}
