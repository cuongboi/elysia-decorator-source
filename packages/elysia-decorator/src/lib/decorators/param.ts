import { createParamDecorator } from './generate';

export const Request = () => createParamDecorator((context) => context.request);
export const Store = () => createParamDecorator((context) => context.store);

export const Path = () => createParamDecorator((context) => context.path);

export const Redirect = () =>
  createParamDecorator((context) => context.redirect);
export const Error = () => createParamDecorator((context) => context.error);
export const Set = () => createParamDecorator((context) => context.set);
export const Params = () => createParamDecorator((context) => context.params);

export const Headers = () => createParamDecorator((context) => context.headers);
export const DecorateCookie = () =>
  createParamDecorator((context) => context.cookie);
export const Query = () => createParamDecorator((context) => context.query);
export const Route = () => createParamDecorator((context) => context.route);

export const Param = (name: string) =>
  createParamDecorator((context) => context.params[name]);

export const Body = () => createParamDecorator((context) => context.body);

export const Context = () => createParamDecorator((context) => context);

export const App = () => createParamDecorator((_, app) => app);

export const DecorateParam = {
  Request,
  Store,
  Path,
  Redirect,
  Error,
  Set,
  Params,
  Headers,
  Cookie: DecorateCookie,
  Query,
  Route,
  Param,
  Body,
};
