import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedUser: User = {
    uid: '',
    displayName: '',
    email: '',
  };

  users$!: Observable<User>;

  ngOnInit() {}

  setUserLoggedIn(user: User) {
    this.loggedUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUserLoggedIn() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  clearUser() {
    localStorage.removeItem('currentUser');
  }
}
