import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
  private readonly userStorageKey = 'demo-auth-user';
  private readonly authState = new BehaviorSubject<boolean>(this.hasToken());
  private readonly userState = new BehaviorSubject<AuthenticatedUser | null>(
    this.getStoredUser(),
  );

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
          localStorage.setItem(
            this.userStorageKey,
            JSON.stringify(response.user),
          );
          this.userState.next(response.user);
          this.authState.next(true);
        }),
      );
  }

  clearToken(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userStorageKey);
    this.userState.next(null);
    this.authState.next(false);
  }

  get token(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authState.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.authState.getValue();
  }

  get user$(): Observable<AuthenticatedUser | null> {
    return this.userState.asObservable();
  }

  get user(): AuthenticatedUser | null {
    return this.userState.getValue();
  }

  logout(): void {
    this.clearToken();
  }

  private hasToken(): boolean {
    return Boolean(localStorage.getItem(this.storageKey));
  }

  private getStoredUser(): AuthenticatedUser | null {
    const stored = localStorage.getItem(this.userStorageKey);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored) as AuthenticatedUser;
    } catch {
      localStorage.removeItem(this.userStorageKey);
      return null;
    }
  }
}
