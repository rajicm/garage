import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

const APIURL = 'http://localhost:3000/users';
@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    const storedLoginStatus = !!userService.isUserLoggedIn();
    if (storedLoginStatus) this.loggedInSubject.next(true);
  }

  register(userData: {
    username: string;
    password: string;
    email: string;
  }): Observable<any> {
    return this.http.post(`${APIURL}/register`, userData);
  }

  login(credentials: { password: string; email: string }): Observable<any> {
    console.log('You are authenticated');
    return this.http.post(`${APIURL}/login`, credentials);
  }

  logout() {
    this.loggedInSubject.next(false);
    this.userService.clearUser();
    this.router.navigate(['/login']);
    console.log('You are logged out');
  }

  ngOnDestroy() {
    this.loggedInSubject.unsubscribe();
  }
}
