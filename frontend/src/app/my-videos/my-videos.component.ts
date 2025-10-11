import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  templateUrl: './my-videos.component.html',
  styleUrls: ['./my-videos.component.scss'],
  imports: [RouterLink],
})
export class MyVideosComponent {
  readonly title = 'My Videos';
  readonly description =
    'This section will list videos saved to your personal collection.';
}
