import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseUIModule } from 'firebaseui-angular';
import { HeaderComponent } from './header/header.component';
import AuthService from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FirebaseUIModule, RouterModule],
  providers: [ AuthService ]
})
export class AppComponent {
  title = 'garage';

  constructor(
    public fbAuth: AngularFireAuth,
    private readonly authService: AuthService
  ) {}

  successLoginCallback() {
    this.authService.login();
  }

  errorLoginCallback(event: any) {
    console.log('Login ERROR', event);
  }
}
