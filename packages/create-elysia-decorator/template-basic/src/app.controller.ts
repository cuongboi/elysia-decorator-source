import { t } from 'elysia';
import { Controller, Get, Post, Body, Params } from 'elysia-decorator';
import { inject, injectable } from 'tsyringe';

import { AppParams, AppPostSchema } from './app.dto';
import { AppService } from './app.service';

@Controller()
@injectable()
export class AppController {
  constructor(@inject(AppService) private appService: AppService) {}
  @Get('/greet/:name', {
    response: {
      200: t.String(),
    },
  })
  async greeting(@Params() params: AppParams) {
    return this.appService.getGreeting(params);
  }

  @Post('/posts', {
    body: AppPostSchema,
    response: t.Object({
      id: t.String(),
      title: t.String(),
      content: t.String(),
    }),
  })
  async createPost(@Body() body: AppPostSchema) {
    return this.appService.createPost(body);
  }
}
