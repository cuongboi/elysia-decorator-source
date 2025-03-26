import { METADATA_KEYS, type MetadataKey, type MetadataValue } from '../types';

export class MetadataUtil {
  /**
   * Defines metadata on a target object.
   */
  static define<K extends MetadataKey, V extends MetadataValue<K>>(
    key: K,
    value: V,
    target: Object,
    propertyKey?: string | symbol,
  ): void {
    propertyKey
      ? Reflect.defineMetadata(METADATA_KEYS[key], value, target, propertyKey)
      : Reflect.defineMetadata(METADATA_KEYS[key], value, target);
  }

  /**
   * Retrieves metadata from a target object.
   */
  static get<
    K extends MetadataKey,
    V extends MetadataValue<K> = MetadataValue<K>,
  >(key: K, target: Object, propertyKey?: string | symbol): V {
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
    target: Object,
    propertyKey?: string | symbol,
  ) {
    propertyKey
      ? Reflect.defineMetadata(METADATA_KEYS[key], value, target, propertyKey)
      : Reflect.defineMetadata(METADATA_KEYS[key], value, target);
  }

  /**
   * Adds a value to an array-type metadata key.
   */
  static add<
    K extends Exclude<MetadataKey, 'MODULE' | 'PREFIX'>,
    V extends MetadataValue<K>,
    T extends MetadataValue<K>[number],
  >(key: K, target: Object, value: T, propertyKey?: string | symbol): void {
    const collection = MetadataUtil.get<K, V>(key, target, propertyKey) ?? [];
    // @ts-expect-error Value type mismatch
    collection.push(value);

    MetadataUtil.define<K, V>(key, collection, target, propertyKey);
  }
}
