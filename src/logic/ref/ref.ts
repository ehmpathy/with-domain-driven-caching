import { refDomainObject } from './refDomainObject';
import { refProperty } from './refProperty';

type Constructor<T> = new (args: T) => T;

/**
 * define a reference to a domain.object or domain.object.property
 *
 * for example
 * - `ref(Ship)` produces a reference to the `Ship` domain object
 * - `ref(Ship, 'isid')` produces a reference to the `Ship.isid` property
 *
 * note
 * - this method uses type overloads to support typing different outputs per inputs
 *   - if only `dobj` is passed in, refDomainObject is called, and it's return type is returned
 *   - if both `dobj` and `prop` are passed in, refProperty is called, and its return type is returned
 */
export function ref<T extends Record<string, any>>(
  dobj: Constructor<T>,
): ReturnType<typeof refDomainObject>;
export function ref<T extends Record<string, any>, P extends keyof T>(
  dobj: Constructor<T>,
  prop: P,
): ReturnType<typeof refProperty>;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function ref<T extends Record<string, any>, P extends keyof T>(
  dobj: Constructor<T>,
  prop?: P,
) {
  if (prop) return refProperty(dobj, prop);
  return refDomainObject(dobj);
}
