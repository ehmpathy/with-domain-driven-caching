import { refDomainObject } from './refDomainObject';

type Constructor<T> = new (args: T) => T;

/**
 * define a reference to a property
 */
export const refProperty = <T extends Record<string, any>, P extends keyof T>(
  dobj: Constructor<T>,
  prop: P,
): { dobj: string; prop: string } => ({
  dobj: refDomainObject(dobj),
  prop: prop as string,
});
