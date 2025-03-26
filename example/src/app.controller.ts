import { t } from 'elysia';
import { Controller, Get, Post, Body, Params } from 'elysia-decorator';
import { inject, injectable } from 'tsyringe';

import { AppPostSchema } from './app.dto';
import { AppService } from './app.service';

@Controller()
@injectable()
export class AppController {
  constructor(@inject(AppService) private appService: AppService) {}

  @Get('/', {
    response: {
      200: t.String(),
    },
  })
  async index() {
    return `Hello Elysia !`;
  }

  @Get('/greet/:name', {
    response: {
      200: t.String(),
    },
  })
  async greeting(@Params() params: { name: string }) {
    return this.appService.getGreeting(params);
  }

  @Post('/posts', {
    body: AppPostSchema,
    response: {
      201: t.Object({
        id: t.String(),
        title: t.String(),
        content: t.String(),
      }),
    },
  })
  async createPost(@Body() body: AppPostSchema) {
    return this.appService.createPost(body);
  }
}
