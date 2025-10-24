import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { Video } from './video.entity';
import { UploadVideoDto } from './dto/upload-video.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  findAll(): Video[] {
    return this.videosService.findAll();
  }

  @Get('my-videos')
  @UseGuards(AuthGuard)
  getMyVideos(@Req() request: any): Video[] {
    const userId = request.user.username;
    return this.videosService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Video {
    const video = this.videosService.findOne(+id);
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadVideoDto: UploadVideoDto,
    @Req() request: any,
  ): Promise<Video> {
    if (!file) {
      throw new BadRequestException('No video file provided');
    }

    const userId = request.user.username;
    return this.videosService.create(uploadVideoDto, file.filename, userId);
  }
}
