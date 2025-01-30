import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import AuthService from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule],
})
export class HeaderComponent {
  @Input() title!: string;
  user$: Observable<User | null> = this.userService.currentUser$;

  constructor(
    readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
}
