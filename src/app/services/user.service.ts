import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userLogged: User = {
    uid: '',
    displayName: '',
    email: '',
  };

  constructor() {}

  setUserLoggedIn(user: User) {
    this.userLogged = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUserLoggedIn() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}' )
  }

  clearUser() {
    localStorage.removeItem('currentUser');
  }
}

