import { injectable } from 'tsyringe';

import { MetadataUtil } from '../metadata/utils';

/**
 * Decorates a class as a controller with an optional path prefix.
 */
export const Controller = (prefix = ''): ClassDecorator => {
  return (target: Function) => {
    injectable()(target as any);
    MetadataUtil.define('PREFIX', prefix, target);
  };
};
