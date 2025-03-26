import { injectable } from 'elysia-decorator';

import { AppPostSchema, AppParams } from './app.dto';

@injectable()
export class AppService {
  getGreeting(params: AppParams) {
    return `Hello, ${params.name}!`;
  }

  createPost(post: AppPostSchema) {
    return { id: '123', ...post };
  }
}
