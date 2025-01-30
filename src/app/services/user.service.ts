import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = this.getLoggedInUser();
    if (storedUser) this.currentUserSubject.next(storedUser);
  }

  setUserLoggedIn(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getLoggedInUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  isUserLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
