import { beforeAll, describe, expect, test } from 'bun:test';
import Elysia, { AnyElysia, t, type Context as ElysiaContext } from 'elysia';

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Head,
  Options,
  Param,
  Context,
  Module,
  useModule,
  Body,
  Params,
  Store,
  Path,
  Query,
  Redirect,
  Error,
  Set,
  Headers,
  DecorateCookie,
  Route,
  App,
  createControllerMiddleware,
  createRouteMiddleware,
} from '../src';

const PostBodySchema = t.Object({
  title: t.String(),
  content: t.String(),
});

const DummyClassMiddleware = () =>
  createControllerMiddleware((app) => {
    app.route('GET', '/dummy-middleware', () => 'Hello World');
  });

const DummyMiddleware = () =>
  createRouteMiddleware((context, app) => {
    console.log('Dummy Middleware');
  });

@Controller()
@DummyClassMiddleware()
class DummyController {
  @Get('/:id/:action', {
    params: t.Object({
      id: t.String(),
      action: t.String(),
    }),
    response: {
      200: t.String(),
    },
  })
  @DummyMiddleware()
  get(
    @Param('id') id: string,
    @Param('action') action: string,
    @Context() context: ElysiaContext,
    @Params() params: Record<string, string>,
    @Store() store: Record<string, any>,
    @Path() path: string,
    @Query() query: Record<string, string>,
    @Redirect() redirect: any,
    @Error() error: any,
    @Set() set: any,
    @Headers() headers: any,
    @DecorateCookie() cookie: any,
    @Route() route: any,
    @App() app: any,
  ) {
    return `GET: id=${id}, action=${action}`;
  }

  @Post('/:id', {
    params: t.Object({
      id: t.String(),
    }),
    body: PostBodySchema,
    response: {
      201: t.String(),
    },
  })
  post(
    @Param('id') id: string,
    @Body() body: typeof PostBodySchema,
    @Context() context: ElysiaContext,
  ) {
    return `POST: id=${id}, title=${body.title}, content=${body.content}`;
  }

  @Put('/')
  put() {
    return 'Hello World';
  }

  @Delete('/')
  delete() {
    return 'Hello World';
  }

  @Patch('/')
  patch() {
    return 'Hello World';
  }

  @Head('/')
  head() {
    return 'Hello World';
  }

  @Options('/')
  options() {
    return 'Hello World';
  }
}

class DummyRegistry {}

@Module({
  controllers: [DummyController],
  registry: [DummyRegistry],
})
class DummyModule {}

describe('App Test', () => {
  let app: AnyElysia;
  let routes: any[];

  beforeAll(() => {
    app = new Elysia().use(useModule(DummyModule)).listen(34567);
    routes = app.routes;
  });

  // Create test for get method with params
  test('GET /:id/:action', async () => {
    const response = await app
      .handle(new Request('http://localhost:34567/123/get'))
      .then((res) => res.text());

    expect(response).toBe('GET: id=123, action=get');
  });

  test('GET /dummy-middleware', async () => {
    const response = await app
      .handle(new Request('http://localhost:34567/dummy-middleware'))
      .then((res) => res.text());

    expect(response).toBe('Hello World');
  });

  test('POST /:id', async () => {
    const response = await app
      .handle(
        new Request('http://localhost:34567/123', {
          method: 'POST',
          body: JSON.stringify({ title: 'Hello', content: 'World' }),
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .then((res) => res.text());

    expect(response).toBe('POST: id=123, title=Hello, content=World');
  });

  // Verify all get parameters
  test('GET /:id/:action with all params', async () => {
    const getRoute = routes.find(
      (route) => route.method === 'GET' && route.path === '/:id/:action',
    );
  });
});
