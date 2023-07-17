import * as moment from "moment";

export const TODAY = moment(new Date()).format('DD-MM-YYYY');
export  const AVAILABLE_PARKING = 'availableParkingSpaces';
export  const RESERVATIONS = 'reservations';
export  const USER_ID = 'userId';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM YYYY',
  },
};
