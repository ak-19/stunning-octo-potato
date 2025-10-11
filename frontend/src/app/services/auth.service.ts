import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  username: string;
  displayName: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthenticatedUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000';
  private readonly storageKey = 'demo-auth-token';

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem(
            this.storageKey,
            `${response.tokenType} ${response.accessToken}`,
          );
        }),
      );
  }

  clearToken(): void {
    localStorage.removeItem(this.storageKey);
  }

  get token(): string | null {
    return localStorage.getItem(this.storageKey);
  }
}
