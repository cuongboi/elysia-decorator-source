import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { useModule } from 'elysia-decorator';

import { AppModule } from './app.module';

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(useModule(AppModule))
  .listen(3000);

console.log(`Server running at http://localhost:${app.server?.port}/swagger`);
