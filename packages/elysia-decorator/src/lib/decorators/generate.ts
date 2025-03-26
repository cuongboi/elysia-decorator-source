import { MetadataUtil } from '../metadata/utils';
import {
  CreateParamDecorator,
  CreateRouteMiddleware,
  CreateControllerMiddleware,
  CreateRouteHandler,
} from '../types';

export const createParamDecorator: CreateParamDecorator = (loadParam) => {
  return (target, propertyKey, parameterIndex) => {
    MetadataUtil.add(
      'PARAM',
      target.constructor,
      [parameterIndex, loadParam],
      propertyKey,
    );
  };
};

export const createRouteMiddleware: CreateRouteMiddleware = (middleware) => {
  return (target, propertyKey) => {
    MetadataUtil.add(
      'METHOD_MIDDLEWARE',
      target as Function,
      middleware,
      propertyKey,
    );
  };
};

export const createControllerMiddleware: CreateControllerMiddleware =
  (middleware) => (target) =>
    MetadataUtil.add('CONTROLLER_MIDDLEWARE', target, middleware);

export const createRouteHandler: CreateRouteHandler =
  (method) => (path, hook) => (target, propertyKey, descriptor) => {
    MetadataUtil.add('ROUTE', target.constructor, {
      method,
      path,
      hook,
      methodName: propertyKey,
      handler: descriptor.value,
      target: target.constructor,
    } as const);

    return descriptor;
  };
