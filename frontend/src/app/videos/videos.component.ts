import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { VideosService } from '../services/videos.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  imports: [NgIf, NgFor, AsyncPipe],
})
export class VideosComponent {
  private readonly videosService = inject(VideosService);
  readonly videos$ = this.videosService.getVideos();
}
