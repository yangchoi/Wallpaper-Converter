import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Header('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  ping() {
    return { ok: true };
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  robots() {
    return 'User-agent: *\nDisallow: /';
  }
}
