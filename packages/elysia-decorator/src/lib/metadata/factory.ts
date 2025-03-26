import { Elysia, HTTPMethod, type AnyElysia, type Context } from 'elysia';
import { container, registry, type DependencyContainer } from 'tsyringe';

import type { ModuleOption, ModuleRegistry, RouteParams } from '../types';
import { MetadataUtil } from './utils';

export class ModuleFactory {
  // Dependency Injection Container
  public static container: DependencyContainer;

  // Metadata Accessors
  private static getModuleMetadata(target: Function): ModuleOption | undefined {
    return MetadataUtil.get('MODULE', target);
  }

  private static getControllerPrefix(target: Function): string {
    return MetadataUtil.get('PREFIX', target) ?? '/';
  }

  public static applyModule(
    target: Function,
    moduleRegistry?: ModuleOption['registry'],
  ) {
    const routes = this.loadModule(target, moduleRegistry);

    return routes.map((route) => this.applyRoute(route));
  }

  // Route Management
  private static loadRoutes(
    target: Function,
    moduleRegistry?: ModuleOption['registry'],
  ) {
    const registries = moduleRegistry?.map((provider) =>
      Object.getOwnPropertyDescriptor(provider, 'constructor')
        ? { token: Symbol(String(provider)), useClass: provider }
        : provider,
    ) as ModuleRegistry;

    registry(registries)(this.container);

    return MetadataUtil.get('ROUTE', target) ?? [];
  }

  private static loadModule(
    module: Function,
    registry: ModuleOption['registry'] = [],
  ): RouteParams[] {
    const moduleMeta = this.getModuleMetadata(module);
    if (!moduleMeta) return [];

    this.container = container.createChildContainer();
    const combinedRegistry = [...registry, ...(moduleMeta.registry ?? [])];

    return [
      ...(moduleMeta.imports ?? []),
      ...(moduleMeta.controllers ?? []),
    ].reduce((acc, cur) => {
      const loadedRoutes = this.loadModule(cur, combinedRegistry);
      const loadRoutes = this.loadRoutes(cur, combinedRegistry);
      return [...acc, ...loadedRoutes, ...loadRoutes];
    }, [] as RouteParams[]);
  }

  private static applyRoute = <
    const Path extends string,
    const Method extends HTTPMethod,
  >(route: {
    method: Method;
    path: Path;
    handler: any;
    hook: any;
    target: any;
    methodName: any;
  }) => {
    const app = new Elysia();

    const target = route.target;
    const instance = this.container.resolve(target) as Record<
      string | symbol,
      Function
    >;
    const prefix = this.getControllerPrefix(target);
    const path = (prefix + route.path)
      .replace(/\/+/g, '/')
      .replace(/(.)\/$/, '$1');

    this.resolveControllerMiddlewares(route, app);

    return app.route(
      route.method,
      path,
      async <Ctx extends Context>(context: Ctx) => {
        const [args] = await Promise.all([
          this.resolveArguments(route, context, app),
          this.resolveRouteMiddlewares(route, context, app),
        ]);

        return instance[route.methodName]?.(...args);
      },
      route.hook,
    );
  };

  private static async resolveArguments(
    route: any,
    context: any,
    app: any,
    defaultValue?: any,
  ) {
    const args: any[] = [];
    const params =
      MetadataUtil.get('PARAM', route.target, route.methodName) ?? [];

    for await (const [index, param] of params) {
      args[index] = await param(context, app, defaultValue);
    }

    return args;
  }

  private static async resolveRouteMiddlewares(
    route: any,
    context: any,
    app: any,
  ) {
    const middlewares =
      MetadataUtil.get('METHOD_MIDDLEWARE', route.target, route.methodName) ??
      [];

    for await (const middleware of middlewares) {
      await middleware.apply(app, [context, app]);
    }
  }

  private static resolveControllerMiddlewares<App extends AnyElysia>(
    route: any,
    app: App,
  ) {
    const middlewares =
      MetadataUtil.get('CONTROLLER_MIDDLEWARE', route.target) ?? [];

    for (const middleware of middlewares) {
      middleware<App['_types']['Prefix']>(app);
    }
    return app;
  }
}
