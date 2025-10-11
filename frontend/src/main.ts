import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter([])],
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Angular bootstrap failed', err);
});
