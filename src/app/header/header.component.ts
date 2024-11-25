import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import AuthService from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule],
  providers: [AuthService, UserService],
})
export class HeaderComponent {
  @Input() title!: string;
  isLoggedIn: boolean = false;

  constructor(
    public readonly authService: AuthService,
    public readonly userService: UserService
  ) {
    this.authService.loggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }
}
