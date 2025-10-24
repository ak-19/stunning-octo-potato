import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { VideosComponent } from './app/videos/videos.component';
import { VideoDetailComponent } from './app/video-detail/video-detail.component';
import { MyVideosComponent } from './app/my-videos/my-videos.component';
import { UploadVideoComponent } from './app/upload-video/upload-video.component';
import { authGuard } from './app/services/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'videos', component: VideosComponent, canActivate: [authGuard] },
  { path: 'videos/:id', component: VideoDetailComponent, canActivate: [authGuard] },
  { path: 'my-videos', component: MyVideosComponent, canActivate: [authGuard] },
  { path: 'upload', component: UploadVideoComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Angular bootstrap failed', err);
});
