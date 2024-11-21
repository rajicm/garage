import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import AuthService from './services/auth.service';
import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, RouterModule],
  providers: [AuthService, UserService],
})
export class AppComponent {
  title = 'Garage';
  isLoggedIn: boolean = false;

  constructor(public readonly authService: AuthService) {
    this.authService.loggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }
}
