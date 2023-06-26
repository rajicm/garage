import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AVAILABLE_PARKING, RESERVATIONS, RESERVED_PARKING, TODAY, USER_ID } from 'src/consts';

@Injectable()
export default class ParkingSpacesService {
  private availableParkingSpacesSubject = new BehaviorSubject<number>(null!);
  availableParkingSpaces$ = this.availableParkingSpacesSubject.asObservable();

  private reservationsTodaySubject = new BehaviorSubject<number>(0);
  reservationsToday$ = this.reservationsTodaySubject.asObservable();

  private parkedUserSubject = new BehaviorSubject<boolean>(false);
  parkedUser$ = this.parkedUserSubject.asObservable();

  private userReservedSubject = new BehaviorSubject<boolean>(false);
  userReserved$ = this.userReservedSubject.asObservable();

  private reservationCountSubject = new BehaviorSubject<number>(0);
  reservationCoun$ = this.reservationCountSubject.asObservable();

  userId: string = this.userService.getUserLoggedIn().uid;

  constructor(
    private dataBase: AngularFireDatabase,
    private readonly userService: UserService
  ) {
    this.setParkedUser();
    // this.getAvailableParkingSpaces();
    this.checkReservationsForToday();
    // this.deleteOldReservations()
    // this.checkIfUserIsParked(this.userId, TODAY)
    // this.dataBase.list('reservations').remove();
    // this.dataBase.object(AVAILABLE_PARKING).remove()
    // this.dataBase.list(PARKED_USERS).remove();
  }

  ngOnInit() {}

  getSubjectValue(subject: BehaviorSubject<number>): number {
    subject.getValue();
    return subject.value;
  }

  areDatesEqual(date1: string, date2: string): boolean {
    return date1.valueOf() == date2.valueOf();
  }

  dateIsOlder(date1: string, date2: string): boolean {
    return date1.valueOf() < date2.valueOf();
  }

  getAvailableParkingSpaces() {
    this.getRecord(AVAILABLE_PARKING).subscribe(
      (availableParkingSpacesData: any) => {
        console.log(
          'number ',
          Number(availableParkingSpacesData[RESERVED_PARKING])
        );
        this.availableParkingSpacesSubject.next(
          Number(availableParkingSpacesData[AVAILABLE_PARKING])
        );
        console.log(
          'subject ',
          this.getSubjectValue(this.reservationsTodaySubject)
        );
      }
    );
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
    // this.saveReservation(RESERVATIONS, date, this.userId, message);
  }

  deleteRecordByUSer(dbName: string, date: string) {
    console.log('delete user');
    // this.dataBase.database.ref(RESERVATIONS+'/'+`${TODAY}`+'/'+user).remove().then(() => {
    //   alert('Deleted')
    // })
  }

  deleteRecordByDate(dbName: string, date: string) {
    this.dataBase.object(dbName + '/' + [date]).remove();
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
    this.deleteRecordByUSer(RESERVATIONS, TODAY);
    return this.updateParkingAvailability(
      this.getSubjectValue(this.reservationsTodaySubject) - 1
    );
  }

  updateParkingAvailability(available: number): number {
    // this.availableParkingSpacesSubject.next(available);
    this.reservationsTodaySubject.next(available);
    this.updatedRecord(AVAILABLE_PARKING, 'reservedParkingSpaces', available);
    return available;
  }

  checkReservationsForToday() {
    this.checkAvailability(TODAY);
  }

  reserveParkingSpace(date: string) {
    console.log('parked sub value ', this.parkedUserSubject.value);
    this.userReservedSubject.next(false);
    this.reservationCountSubject.next(0);
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
      console.log('ima rez ', reservations.length);
      if (this.areDatesEqual(date, TODAY)) {
        // this.reservationsTodaySubject.next(10-reservations.length);
        this.updateParkingAvailability(reservations.length);
        // this.updateParkingAvailability(this.getSubjectValue(this.availableParkingSpacesSubject) - reservations.length)
      } else {
        this.reservationCountSubject.next(reservations.length);
      }
      console.log(
        'rez sub ',
        this.getSubjectValue(this.reservationsTodaySubject)
      );
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

  deleteOldReservations() {
    this.getKeys(RESERVATIONS).subscribe((reservations) => {
      reservations.forEach((reservation: any) => {
        if (this.dateIsOlder(reservation.key, '22-06-2023')) {
          this.deleteRecordByDate(RESERVATIONS, reservation.key);
          this.updateParkingAvailability(
            this.getSubjectValue(this.availableParkingSpacesSubject) + 1
          );
          console.log('u ifu');
        }
      });
    });
    this.setParkedUser();
  }
}
