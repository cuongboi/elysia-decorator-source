import { ModuleFactory } from './metadata/factory';
import type { ModuleOption } from './types';

export const useModule = (
  module: Function,
  registry?: ModuleOption['registry'],
) => ModuleFactory.applyModule(module, registry);
