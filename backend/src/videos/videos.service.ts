import { Injectable } from '@nestjs/common';
import { Video } from './video.entity';

@Injectable()
export class VideosService {
  private readonly videos: Video[] = [
    {
      id: 1,
      title: 'Intro to NestJS',
      description: 'Learn the basics of building APIs with NestJS.',
      thumbnailUrl: 'https://placehold.co/320x180?text=NestJS',
      duration: '12:34',
    },
    {
      id: 2,
      title: 'Understanding Angular Signals',
      description:
        'A quick primer on state management with Angular 17 signals.',
      thumbnailUrl: 'https://placehold.co/320x180?text=Angular',
      duration: '08:20',
    },
    {
      id: 3,
      title: 'RxJS in Practice',
      description: 'Hands-on patterns for composing Observables effectively.',
      thumbnailUrl: 'https://placehold.co/320x180?text=RxJS',
      duration: '16:02',
    },
  ];

  findAll(): Video[] {
    return this.videos;
  }
}
