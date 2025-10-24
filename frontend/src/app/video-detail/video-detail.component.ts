import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideosService, VideoDto } from '../services/videos.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
})
export class VideoDetailComponent implements OnInit {
  video$!: Observable<VideoDto>;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly videosService: VideosService
  ) {}

  ngOnInit(): void {
    this.video$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (!id) {
          this.router.navigate(['/videos']);
          throw new Error('No video ID provided');
        }
        return this.videosService.getVideo(+id);
      })
    );
  }

  onVideoError(event: Event): void {
    this.errorMessage = 'Failed to load video. The video file may not be available.';
  }

  goBack(): void {
    this.router.navigate(['/videos']);
  }
}
