import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { VideosService, VideoDto } from '../services/videos.service';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  templateUrl: './my-videos.component.html',
  styleUrls: ['./my-videos.component.scss'],
  imports: [CommonModule, RouterLink],
})
export class MyVideosComponent implements OnInit {
  videos$!: Observable<VideoDto[]>;

  constructor(private readonly videosService: VideosService) {}

  ngOnInit(): void {
    this.videos$ = this.videosService.getMyVideos();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/320x180?text=No+Thumbnail';
  }
}
