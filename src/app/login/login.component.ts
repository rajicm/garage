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
  ],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoginMode = true; // Toggle between login and register modes
  authForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        name: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: matchPasswordsValidator() }
    );
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.removeControl('name');
      this.authForm.removeControl('confirmPassword');
      this.authForm.get('name')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
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

    const { email, password } = this.authForm.value;

    if (this.isLoginMode) {
      console.log('Logging in:', email, password);
      // Perform login logic
    } else {
      console.log('Registering:', email, password);
      // Perform registration logic
    }
  }
}
