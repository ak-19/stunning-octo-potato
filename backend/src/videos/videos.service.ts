import { Injectable } from '@nestjs/common';
import { Video } from './video.entity';
import { UploadVideoDto } from './dto/upload-video.dto';
import * as ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class VideosService {
  private videos: Video[] = [
    {
      id: 1,
      title: 'Intro to NestJS',
      description: 'Learn the basics of building APIs with NestJS.',
      thumbnailUrl: 'https://placehold.co/320x180?text=NestJS',
      videoUrl: 'https://example.com/videos/sample1.mp4',
      duration: '12:34',
      userId: 'demo',
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Understanding Angular Signals',
      description:
        'A quick primer on state management with Angular 17 signals.',
      thumbnailUrl: 'https://placehold.co/320x180?text=Angular',
      videoUrl: 'https://example.com/videos/sample2.mp4',
      duration: '08:20',
      userId: 'demo',
      uploadedAt: new Date('2024-01-20'),
    },
    {
      id: 3,
      title: 'RxJS in Practice',
      description: 'Hands-on patterns for composing Observables effectively.',
      thumbnailUrl: 'https://placehold.co/320x180?text=RxJS',
      videoUrl: 'https://example.com/videos/sample3.mp4',
      duration: '16:02',
      userId: 'demo',
      uploadedAt: new Date('2024-01-25'),
    },
  ];

  private nextId = 4;

  findAll(): Video[] {
    return this.videos;
  }

  findOne(id: number): Video | undefined {
    return this.videos.find((video) => video.id === id);
  }

  findByUser(userId: string): Video[] {
    return this.videos.filter((video) => video.userId === userId);
  }

  async create(
    uploadVideoDto: UploadVideoDto,
    videoFilename: string,
    userId: string,
  ): Promise<Video> {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const videosDir = path.join(uploadsDir, 'videos');
    const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

    // Ensure thumbnails directory exists
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    const videoPath = path.join(videosDir, videoFilename);
    const thumbnailFilename = `${path.parse(videoFilename).name}.jpg`;
    const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

    // Generate thumbnail and get video duration
    let duration = '00:00';
    try {
      const metadata = await this.getVideoMetadata(videoPath);
      duration = this.formatDuration(metadata.format.duration || 0);
      await this.generateThumbnail(videoPath, thumbnailPath);
    } catch (error) {
      console.error('Error processing video:', error);
      // Continue without thumbnail/duration if processing fails
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const video: Video = {
      id: this.nextId++,
      title: uploadVideoDto.title,
      description: uploadVideoDto.description,
      videoUrl: `${baseUrl}/uploads/videos/${videoFilename}`,
      thumbnailUrl: fs.existsSync(thumbnailPath)
        ? `${baseUrl}/uploads/thumbnails/${thumbnailFilename}`
        : 'https://placehold.co/320x180?text=Uploaded+Video',
      duration,
      userId,
      uploadedAt: new Date(),
    };

    this.videos.push(video);
    return video;
  }

  private getVideoMetadata(videoPath: string): Promise<ffmpeg.FfprobeData> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  }

  private generateThumbnail(
    videoPath: string,
    thumbnailPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['5%'],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '320x180',
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
