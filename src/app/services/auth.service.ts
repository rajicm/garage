import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  user: User = this.userService.getLoggedInUser();
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {
    const storedLoginStatus = !!userService.isUserLoggedIn();
    if (storedLoginStatus) this.loggedInSubject.next(true);
  }

  login(email: string) {
    this.loggedInSubject.next(true);
    this.userService.setUserLoggedIn({ uid: 'Maja', email: email });
    this.router.navigate(['/garage']);
    console.log('You are authenticated');
  }

  logout() {
    this.loggedInSubject.next(false);
    this.router.navigate(['']);
    this.userService.clearUser();
    console.log('You are logged out');
  }

  ngOnDestroy() {
    this.loggedInSubject.unsubscribe();
  }

  //auth service
  // private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  // constructor(private http: HttpClient) {}

  // login(email: string, password: string) {
  //   return this.http.post(`${this.apiUrl}/login`, { email, password });
  // }

  // register(email: string, password: string) {
  //   return this.http.post(`${this.apiUrl}/register`, { email, password });
  // }
}
