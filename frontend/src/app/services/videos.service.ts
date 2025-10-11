import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VideoDto {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
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
}
