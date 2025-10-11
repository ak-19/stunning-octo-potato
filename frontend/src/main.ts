import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { VideosComponent } from './app/videos/videos.component';
import { authGuard } from './app/services/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'videos', component: VideosComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Angular bootstrap failed', err);
});
