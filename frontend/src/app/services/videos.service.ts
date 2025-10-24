import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VideoDto {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  videoUrl?: string;
  userId?: string;
  uploadedAt?: Date;
}

export interface UploadVideoDto {
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  getVideos(): Observable<VideoDto[]> {
    return this.http.get<VideoDto[]>(`${this.baseUrl}/videos`);
  }

  getVideo(id: number): Observable<VideoDto> {
    return this.http.get<VideoDto>(`${this.baseUrl}/videos/${id}`);
  }

  getMyVideos(): Observable<VideoDto[]> {
    const token = localStorage.getItem('demo-auth-token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });
    return this.http.get<VideoDto[]>(`${this.baseUrl}/videos/my-videos`, { headers });
  }

  uploadVideo(file: File, videoData: UploadVideoDto): Observable<VideoDto> {
    const token = localStorage.getItem('demo-auth-token');
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);

    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http.post<VideoDto>(`${this.baseUrl}/videos/upload`, formData, { headers });
  }
}
