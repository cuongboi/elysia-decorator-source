import cors from '@elysiajs/cors';
import { treaty } from '@elysiajs/eden';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { useModule } from 'elysia-decorator';

import { AppModule } from './app.module';

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(useModule(AppModule))

  .listen(3000);

export declare type App = typeof app;

export const api = treaty<App>('');

console.log(`Server running at http://localhost:${app.server?.port}/swagger`);
