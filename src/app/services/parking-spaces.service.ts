import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { AVAILABLE_PARKING, RESERVATIONS, TODAY, USER_ID } from 'src/consts';

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
  userId: string;

  private reservationsSubject: BehaviorSubject<any>;

  constructor(
    private dataBase: AngularFireDatabase,
    private readonly userService: UserService
  ) {
    this.userId = this.userService.getUserLoggedIn().uid;
    this.reservationsSubject = this.getRecords(RESERVATIONS);
    this.checkReservationsForToday();
  }

  getSubjectValue(subject: BehaviorSubject<number>): number {
    subject.getValue();
    return subject.value;
  }

  areDatesEqual(date1: string, date2: string): boolean {
    return date1.valueOf() == date2.valueOf();
  }

  setParkedUser() {
    this.findUserInReservations(TODAY);
  }

  findUserInReservations(date: string) {
    this.reservationsSubject.forEach((data) => {
      if (data[date]) {
        for (let record in data[date]) {
          this.reservationCountSubject.next(Object.keys(data[date]).length);
          if (data[date][record][USER_ID] === this.userId) {
            if (this.areDatesEqual(TODAY, date)) {
              this.parkedUserSubject.next(true);
            }
            this.userReservedSubject.next(true);
          }
        }
        if (this.areDatesEqual(TODAY, date)) {
          this.updateParkingAvailability(Object.keys(data[TODAY]).length);
        }
      }
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

  getRecords(dbName: string, date?: string): BehaviorSubject<any> {
    const subject = new BehaviorSubject<any[]>([]);
    this.dataBase
      .object(dbName + '/' + [date])
      .valueChanges()
      .subscribe((val: any) => {
        subject.next(val);
      });
    return subject;
  }

  reservation(date: string, message: string) {
    this.saveReservation(RESERVATIONS, date, this.userId, message);
  }

  findAndDeleteRecord(date: string) {
    this.reservationsSubject.forEach((data) => {
      if (data[date]) {
        for (let record in data[date]) {
          if (data[date][record][USER_ID] === this.userId) {
            this.deleteRecord(RESERVATIONS, date, record);
          }
        }
      }
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
    this.userReservedSubject.next(false);
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
    this.findUserInReservations(date);
  }

  getAllReservationDates() {
    let reservationDates: any = [];
    this.reservationsSubject.forEach((reservations: any) => {
      for (let date in reservations) {
        for (let record in reservations[date]) {
          if (
            reservations[date][record][USER_ID] === this.userId &&
            !reservationDates.includes(date)
          ) {
            reservationDates.push(date);
          }
        }
      }
    });
    return reservationDates;
  }
}
