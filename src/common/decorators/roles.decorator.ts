export const Roles = (...roles: string[]) => {
  return (
    target: object,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    if (typeof target === 'function') {
      Reflect.defineMetadata('roles', roles, target);
    } else if (key && descriptor) {
      Reflect.defineMetadata('roles', roles, target, key);
    } else {
      throw new Error('Invalid usage of Roles decorator');
    }
  };
};
