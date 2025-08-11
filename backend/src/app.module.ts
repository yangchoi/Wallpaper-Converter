import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConvertModule } from './convert/convert.module';
import { StaticModule } from './static.module';

@Module({
  imports: [MulterModule.register({}), StaticModule, ConvertModule],
})
export class AppModule {}
