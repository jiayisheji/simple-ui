import { SafeAny } from '@ngx-simple/core/types';

export const ObjectType = {
  argsTag: '[object Arguments]',
  arrayTag: '[object Array]',
  asyncTag: '[object AsyncFunction]',
  boolTag: '[object Boolean]',
  dateTag: '[object Date]',
  domExcTag: '[object DOMException]',
  errorTag: '[object Error]',
  funcTag: '[object Function]',
  genTag: '[object GeneratorFunction]',
  mapTag: '[object Map]',
  numberTag: '[object Number]',
  nullTag: '[object Null]',
  objectTag: '[object Object]',
  promiseTag: '[object Promise]',
  proxyTag: '[object Proxy]',
  regexpTag: '[object RegExp]',
  setTag: '[object Set]',
  stringTag: '[object String]',
  symbolTag: '[object Symbol]',
  undefinedTag: '[object Undefined]',
  weakMapTag: '[object WeakMap]',
  weakSetTag: '[object WeakSet]'
};

const objectToString = Object.prototype.toString;

/**
 * 获取当前值 Object.prototype.toString() 处理后类型
 * @param target
 */
export function typeOf(target: SafeAny): string {
  if (target == null) {
    return target === undefined ? ObjectType.undefinedTag : ObjectType.nullTag;
  }
  return objectToString.call(target);
}
