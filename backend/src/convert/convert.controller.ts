import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { ConvertService } from './convert.service';
import type { ConvertOptions, TargetPlatform } from './dto';

@Controller('convert')
export class ConvertController {
  constructor(private readonly svc: ConvertService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) =>
          cb(null, join(process.cwd(), 'uploads')),
        filename: (req, file, cb) =>
          cb(null, randomUUID() + extname(file.originalname)),
      }),
      limits: { fileSize: 1024 * 1024 * 512 }, // 512MB
    }),
  )
  async convert(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!file) throw new BadRequestException('file required');

    const target = (body.target as TargetPlatform) || 'mac';
    const width = body.width ? parseInt(body.width, 10) : undefined;
    const height = body.height ? parseInt(body.height, 10) : undefined;
    const fps = body.fps ? parseInt(body.fps, 10) : undefined;

    const result = await this.svc.convert(file.path, {
      target,
      width,
      height,
      fps,
    } as ConvertOptions);
    return { url: result.publicUrl };
  }
}
