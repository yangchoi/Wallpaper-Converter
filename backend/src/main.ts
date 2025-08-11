import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ensureDir } from 'fs-extra';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.PORT) || 8000;
  await app.listen(port, '0.0.0.0');
  console.log(`Nest API running on http://localhost:${port}`);
}
bootstrap();
