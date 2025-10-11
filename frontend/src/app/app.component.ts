import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, AsyncPipe],
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly title = 'Stunning Octo Potato';
  readonly isAuthenticated$ = this.authService.isAuthenticated$;

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
