type Constructor<T> = new (args: T) => T;

/**
 * define a reference to a property
 */
export const refDomainObject = <T extends Record<string, any>>(
  dobj: Constructor<T>,
): string => dobj.name;
