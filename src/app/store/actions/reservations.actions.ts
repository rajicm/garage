import { Action } from '@ngrx/store';

export enum ReservationActionType {
  ADD_RESERVATION = '[RESERVATION] Add RESERVATION',
}

export enum ReservationActionType {
  DELETE_RESERVATION = '[RESERVATION] Delete RESERVATION',
}

export enum ReservationActionType {
  GET_RESERVATION = '[RESERVATION] Get RESERVATION',
}

export class AddReservationAction implements Action {
  readonly type = ReservationActionType.ADD_RESERVATION;
  constructor(public payload: any) {}
}

export class DeleteReservationAction implements Action {
  readonly type = ReservationActionType.DELETE_RESERVATION;
  constructor(public payload: any) {}
}

export class GetReservationAction implements Action {
  readonly type = ReservationActionType.GET_RESERVATION;
  constructor(public payload: any) {}
}
