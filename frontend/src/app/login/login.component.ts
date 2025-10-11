import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, LoginResponse } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly subscriptions = new Subscription();

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage = '';
  successMessage = '';
  loading = false;
  lastResponse: LoginResponse | null = null;

  submit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.lastResponse = null;

    const request = this.authService.login(this.loginForm.getRawValue());
    this.subscriptions.add(
      request.subscribe({
        next: (response) => {
          this.lastResponse = response;
          this.successMessage = `Welcome back, ${response.user.displayName}!`;
          this.loading = false;
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password.';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
          this.loading = false;
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private markAllAsTouched(): void {
    Object.values(this.loginForm.controls).forEach((control) =>
      control.markAsTouched(),
    );
  }
}
