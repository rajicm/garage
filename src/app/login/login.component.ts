import { Component } from '@angular/core';
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
export class LoginComponent {
  isLoginMode = true;
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.authForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        name: [''],
        confirmPassword: [''],
      },
      { validators: !this.isLoginMode ? matchPasswordsValidator() : null }
    );
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.get('name')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.removeControl('name');
      this.authForm.removeControl('confirmPassword');
    } else {
      this.authForm.addControl('name', this.fb.control(''));
      this.authForm.addControl('confirmPassword', this.fb.control(''));
      this.authForm.get('name')?.setValidators([Validators.required]);
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
      console.log('Logging in:', email, password);
      this.authService.login({ username, password });
      // Perform login logic
    } else {
      console.log('Registering:', email, password);
      this.authService.register({ username, password, email });
      // Perform registration logic
    }
  }
}
