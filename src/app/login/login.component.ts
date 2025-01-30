import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { matchPasswordsValidator } from '../utils/matchPasswordValidator';
import { HttpClientModule } from '@angular/common/http';
import AuthService from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    public readonly userService: UserService
  ) {
    this.authForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        username: [''],
        confirmPassword: [''],
      },
      { validators: !this.isLoginMode ? matchPasswordsValidator() : null }
    );
  }

  ngOnInit() {
    if (this.userService.isUserLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.get('username')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.removeControl('nusernameame');
      this.authForm.removeControl('confirmPassword');
    } else {
      this.authForm.addControl('username', this.fb.control(''));
      this.authForm.addControl('confirmPassword', this.fb.control(''));
      this.authForm.get('username')?.setValidators([Validators.required]);
      this.authForm
        .get('confirmPassword')
        ?.setValidators([Validators.required]);
    }
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }

    const { email, password, username } = this.authForm.value;

    if (this.isLoginMode) {
      console.log('Logging in:', email, password, email);
      this.authService.login({ password, email }).subscribe((response) => {
        console.log('Response from logging the user ', response.user);
        this.userService.setUserLoggedIn(response.user);
        this.router.navigate(['']);
      });
    } else {
      console.log('Registering:', email, password, username);
      this.authService
        .register({ username, password, email })
        .subscribe((response) => {
          console.log('Response from registering the user ', response);
          this.router.navigate(['']);
        });
    }
  }
}
