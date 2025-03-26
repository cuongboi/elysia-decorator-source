import { Module } from 'elysia-decorator';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}
