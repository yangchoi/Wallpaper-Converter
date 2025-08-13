import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  // 앱 생성
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    methods: ['GET', 'POST', 'HEAD'],
  });

  app.use('/files', express.static(join(__dirname, '..', 'converted')));

  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true });
  const port = Number(process.env.PORT) || 8000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
