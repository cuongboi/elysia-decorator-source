import type { TModule } from '@sinclair/typebox';
import type {
  Context,
  DefinitionBase,
  EphemeralType,
  HTTPMethod,
  InputSchema,
  MergeSchema,
  MetadataBase,
  SingletonBase,
  UnwrapRoute,
  LocalHook,
  AnyElysia,
} from 'elysia';
import { JoinPath, MacroToContext, UnwrapTypeModule } from 'elysia/dist/types';
import type { InjectionToken, Provider, registry } from 'tsyringe';
import type {
  constructor,
  RegistrationOptions,
} from 'tsyringe/dist/typings/types';

export type AnyCallable<T = any> = (...args: any[]) => T;
export type NoInfer<T> = [T][T extends any ? 0 : never];

export interface ModuleOption {
  controllers?: Array<Function>;
  imports?: Array<Function>;
  registry?: Array<
    | ({ token: InjectionToken; options?: RegistrationOptions } & Provider<any>)
    | constructor<unknown>
  >;
}

export type RouteParamLoader<
  C extends Context = Context,
  A extends AnyElysia = AnyElysia,
  T = unknown,
> = (context: C, app: A, value?: T) => Promise<T> | T;

export type RouteMiddleware<
  C extends Context = Context,
  A extends AnyElysia = AnyElysia,
> = (context: C, app: A) => Promise<void> | void;

export type ModuleRegistry = Parameters<typeof registry>[0];

export type ControllerMiddleware = <App extends AnyElysia>(
  app: App,
) => Promise<void> | void;

export type CreateParamDecorator<
  A extends AnyElysia = AnyElysia,
  C extends Context = Context,
  T = unknown,
  R extends RouteParamLoader<C, A, T> = RouteParamLoader<C, A, T>,
> = (loadParam: R) => ParameterDecorator;

export type CreateRouteMiddleware = (
  middleware: RouteMiddleware,
) => MethodDecorator;

export type CreateControllerMiddleware = (
  middleware: ControllerMiddleware,
) => ClassDecorator;

export type RouteParams<
  Path extends string = string,
  Method extends HTTPMethod = HTTPMethod,
> = {
  method: Method;
  path: Path;
  handler: any;
  hook: any;
  target: any;
  methodName: any;
};

export type CreateRouteHandler = <
  const App extends AnyElysia,
  const Path extends string,
  const Method extends HTTPMethod,
  const Singleton extends SingletonBase = {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
  },
  const Definitions extends DefinitionBase = {
    typebox: TModule<{}>;
    type: {};
    error: {};
  },
  const Metadata extends MetadataBase = {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
  },
  const Ephemeral extends EphemeralType = {
    derive: {};
    resolve: {};
    schema: {};
  },
  const Volatile extends EphemeralType = {
    derive: {};
    resolve: {};
    schema: {};
  },
>(
  method: Method,
) => <
  const LocalSchema extends InputSchema<
    keyof UnwrapTypeModule<Definitions['typebox']> & string
  >,
  const Schema extends MergeSchema<
    UnwrapRoute<
      LocalSchema,
      Definitions['typebox'],
      JoinPath<App['_types']['Prefix'], Path>
    >,
    MergeSchema<
      Volatile['schema'],
      MergeSchema<Ephemeral['schema'], Metadata['schema']>
    >
  >,
  const Macro extends Metadata['macro'],
  const MacroContext extends MacroToContext<
    Metadata['macroFn'],
    NoInfer<Macro>
  >,
  const Hook extends LocalHook<
    LocalSchema,
    Schema,
    Singleton & {
      derive: Ephemeral['derive'] & Volatile['derive'];
      resolve: Ephemeral['resolve'] & Volatile['resolve'] & MacroContext;
    },
    Definitions['error'],
    Macro,
    keyof Metadata['macro'],
    keyof Metadata['parser'] & string
  >,
>(
  path: Path,
  hook?: Hook,
) => (
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;

export const METADATA_KEYS = {
  MODULE: Symbol('elysia:decorator:module'),
  ROUTE: Symbol('elysia:decorator:routes'),
  PREFIX: Symbol('elysia:decorator:prefix'),
  PARAM: Symbol('elysia:decorator:param'),
  METHOD_MIDDLEWARE: Symbol('elysia:decorator:method-middleware'),
  CONTROLLER_MIDDLEWARE: Symbol('elysia:decorator:controller-middleware'),
};

export type MetadataKey = keyof typeof METADATA_KEYS;

export type MetadataValue<
  T extends MetadataKey,
  Path extends string = string,
  Method extends HTTPMethod = HTTPMethod,
> = T extends 'MODULE'
  ? ModuleOption
  : T extends 'ROUTE'
    ? Array<RouteParams<Path, Method>>
    : T extends 'PREFIX'
      ? string
      : T extends 'PARAM'
        ? Array<[number, RouteParamLoader]>
        : T extends 'METHOD_MIDDLEWARE'
          ? Array<RouteMiddleware>
          : T extends 'CONTROLLER_MIDDLEWARE'
            ? Array<ControllerMiddleware>
            : never;
