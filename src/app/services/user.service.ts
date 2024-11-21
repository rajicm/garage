import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedUser: User = {
    uid: '',
    // displayName: '',
    email: '',
  };

  users$!: Observable<User>;

  ngOnInit() {}

  setUserLoggedIn(user: User) {
    this.loggedUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  isUserLoggedIn(): boolean {
    return !!Object.entries(this.getLoggedInUser()).length;
  }

  clearUser() {
    localStorage.removeItem('currentUser');
  }
}
