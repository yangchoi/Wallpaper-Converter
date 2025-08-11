import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ensureDir } from 'fs-extra';
import { join } from 'path';

async function bootstrap() {
  await ensureDir(join(process.cwd(), 'uploads'));
  await ensureDir(join(process.cwd(), 'converted'));

  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ limit: '200mb', extended: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Nest API running on http://localhost:${port}`);
}
bootstrap();
