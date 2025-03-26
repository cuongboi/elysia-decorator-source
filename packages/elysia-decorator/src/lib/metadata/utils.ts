import { METADATA_KEYS, type MetadataKey, type MetadataValue } from '../types';

export class MetadataUtil {
  /**
   * Defines metadata on a target object.
   */
  static define<K extends MetadataKey, V extends MetadataValue<K>>(
    key: K,
    value: V,
    target: Function,
    propertyKey?: string | symbol,
  ): void {
    if (propertyKey) {
      Reflect.defineMetadata(METADATA_KEYS[key], value, target, propertyKey);
    } else {
      Reflect.defineMetadata(METADATA_KEYS[key], value, target);
    }
  }

  /**
   * Retrieves metadata from a target object.
   */
  static get<
    K extends MetadataKey,
    V extends MetadataValue<K> = MetadataValue<K>,
  >(key: K, target: Function, propertyKey?: string | symbol): V {
    return propertyKey
      ? Reflect.getMetadata(METADATA_KEYS[key], target, propertyKey)
      : Reflect.getMetadata(METADATA_KEYS[key], target);
  }

  /**
   * Sets metadata on a target object.
   */
  static set<K extends MetadataKey, V extends MetadataValue<K>>(
    key: K,
    value: V,
    target: Function,
    propertyKey?: string | symbol,
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(METADATA_KEYS[key], value, target, propertyKey);
    } else {
      Reflect.defineMetadata(METADATA_KEYS[key], value, target);
    }
  }

  /**
   * Adds a value to an array-type metadata key.
   */
  static add<
    K extends Exclude<MetadataKey, 'MODULE' | 'PREFIX'>,
    V extends MetadataValue<K>,
    T extends V[number],
  >(key: K, target: Function, value: T, propertyKey?: string | symbol): void {
    const collection = MetadataUtil.get<K, V>(key, target, propertyKey) ?? [];
    // @ts-expect-error Value type mismatch
    collection.push(value);

    MetadataUtil.define(key, collection, target, propertyKey);
  }
}
