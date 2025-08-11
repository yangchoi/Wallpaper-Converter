import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import { ensureDir } from 'fs-extra';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import type { ConvertOptions } from './dto';

@Injectable()
export class ConvertService {
  async convert(inputPath: string, opts: ConvertOptions) {
    const outDir = join(process.cwd(), 'converted');
    await ensureDir(outDir);

    const id = randomUUID();
    const base = join(outDir, id);

    const { target, width = 1920, height = 1080, fps = 30 } = opts;

    const argsCommon = [
      '-y',
      '-i',
      inputPath,
      '-vf',
      `scale=${width}:${height},fps=${fps}`,
    ];

    let outPath = '';
    let args: string[] = [];

    if (target === 'mac') {
      // MOV (H.264) for broader compatibility & smaller size than ProRes
      outPath = `${base}.mov`;
      args = [
        ...argsCommon,
        '-c:v',
        'h264',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        outPath,
      ];
    } else if (target === 'windows-webm') {
      outPath = `${base}.webm`;
      args = [...argsCommon, '-c:v', 'libvpx-vp9', '-b:v', '4M', outPath];
    } else if (target === 'windows-mp4') {
      outPath = `${base}.mp4`;
      args = [
        ...argsCommon,
        '-c:v',
        'libx264',
        '-crf',
        '23',
        '-preset',
        'veryfast',
        '-movflags',
        '+faststart',
        outPath,
      ];
    } else {
      throw new InternalServerErrorException('Unknown target');
    }

    await this.runFfmpeg(args);

    const filename = outPath.split('/').pop()!;
    const publicUrl = `/files/${filename}`; // served via StaticModule

    return { id, outPath, publicUrl };
  }

  private runFfmpeg(args: string[]) {
    return new Promise<void>((resolve, reject) => {
      const ff = spawn('ffmpeg', args);
      let stderr = '';

      ff.stderr.on('data', (d) => {
        stderr += d.toString();
      });
      ff.on('error', reject);
      ff.on('close', (code) => {
        if (code === 0) return resolve();
        reject(new InternalServerErrorException('FFmpeg failed: ' + stderr));
      });
    });
  }
}
