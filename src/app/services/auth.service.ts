import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();
  private apiUrl = 'http://localhost:3000';

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
    console.log('You are authenticated');
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    console.log('You are authenticated');
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // login(email: string, password: string) {
  //   this.loggedInSubject.next(true);
  //   this.userService.setUserLoggedIn({ uid: 'Maja', email: email });
  //   this.router.navigate(['/garage']);
  //   console.log('You are authenticated');
  //   return this.http.post(`${this.apiUrl}/login`, { email, password });
  // }

  // register(username: string, password: string, email: string) {
  //   return this.http.post(`${this.apiUrl}/register`, {
  //     username,
  //     password,
  //     email,
  //   });
  // }

  logout() {
    this.loggedInSubject.next(false);
    this.router.navigate(['']);
    this.userService.clearUser();
    console.log('You are logged out');
  }

  ngOnDestroy() {
    this.loggedInSubject.unsubscribe();
  }
}
