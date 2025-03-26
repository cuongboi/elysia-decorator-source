import { MetadataUtil } from '../metadata/utils';
import type { ModuleOption } from '../types';

/**
 * Module decorator to define a module in the Elysia framework.
 * @param module - The module options to be associated with the target class.
 */
export function Module(module: ModuleOption): ClassDecorator {
  return function (target: Function) {
    MetadataUtil.set('MODULE', module, target);
  };
}
