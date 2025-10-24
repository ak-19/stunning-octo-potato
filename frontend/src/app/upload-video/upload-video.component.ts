import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideosService } from '../services/videos.service';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css'],
})
export class UploadVideoComponent implements OnDestroy {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  videoPreviewUrl: string | null = null;
  thumbnailDataUrl: string | null = null;
  errorMessage = '';
  successMessage = '';
  isUploading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly videosService: VideosService,
    private readonly router: Router,
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      const maxSize = 100 * 1024 * 1024; // 100MB

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Please upload MP4, WebM, OGG, or MOV files.';
        this.selectedFile = null;
        this.clearPreviews();
        input.value = '';
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = 'File size exceeds 100MB limit.';
        this.selectedFile = null;
        this.clearPreviews();
        input.value = '';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
      this.generateVideoPreview(file);
    }
  }

  private generateVideoPreview(file: File): void {
    // Create video preview URL
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
    }
    this.videoPreviewUrl = URL.createObjectURL(file);

    // Generate thumbnail from video
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = this.videoPreviewUrl;

    video.onloadeddata = () => {
      // Seek to 5% of video duration or 1 second
      video.currentTime = Math.min(video.duration * 0.05, 1);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Calculate dimensions to maintain aspect ratio
        const videoAspect = video.videoWidth / video.videoHeight;
        const canvasAspect = canvas.width / canvas.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (videoAspect > canvasAspect) {
          drawHeight = canvas.width / videoAspect;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * videoAspect;
          offsetX = (canvas.width - drawWidth) / 2;
        }

        // Fill background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw video frame
        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

        this.thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      }
    };
  }

  private clearPreviews(): void {
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
    this.thumbnailDataUrl = null;
  }

  ngOnDestroy(): void {
    this.clearPreviews();
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.errorMessage = 'Please fill in all fields and select a video file.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const uploadData = {
      title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
    };

    this.videosService.uploadVideo(this.selectedFile, uploadData).subscribe({
      next: () => {
        this.successMessage = 'Video uploaded successfully!';
        this.isUploading = false;
        setTimeout(() => {
          this.router.navigate(['/my-videos']);
        }, 1500);
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = error.error?.message || 'Failed to upload video. Please try again.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/videos']);
  }
}
