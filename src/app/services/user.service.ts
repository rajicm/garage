import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { UserState } from '../store/reducers/user.reducer';
import { user } from '@angular/fire/auth';
import { AddUser, DeleteUser } from '../store/actions/users.actions';


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

  constructor(private readonly store: Store<UserState>) {
    this.users$ = store.pipe(select('user'))
  }

  ngOnInit() {}

  setUserLoggedIn(user: User) {
    this.loggedUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.store.dispatch(new AddUser(this.loggedUser));
  }

  getUserLoggedIn() {
    this.users$ = this.store.pipe(select('user'));
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  clearUser() {
    localStorage.removeItem('currentUser');
    this.store.dispatch(new DeleteUser())
    
  }
}
