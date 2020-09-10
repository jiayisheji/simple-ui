import { isArray, isArrayLike, isMap, isPrototype, isSet, isString } from '@ngx-simple/core/typeof';
import { SafeAny } from '@ngx-simple/core/types';

/**
 * use `hasOwnProperty.call(obj, propertyKey)`
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @description 检查提供的值是否为空或其长度是否等于0。
 * @param value 任意值
 * @returns 如果值是空对象，空数组，空字符串，空，则返回true; 如果值是数字和布尔值，则返回true; 如果集合没有可枚举属性，或任何类型不被视为集合，则返回true。
 * @example
 *
 * isEmpty(null);
 * // => true
 *
 * isEmpty(true);
 * // => true
 *
 * isEmpty(1);
 * // => true
 *
 * isEmpty([1, 2, 3]);
 * // => false
 *
 * isEmpty({ 'a': 1 });
 * // => false
 */
export function isEmpty(value: SafeAny): boolean {
  // null or undefined
  if (value == null) {
    return true;
  }

  if (isArrayLike(value) && (isString(value) || isArray(value))) {
    return !value.length;
  }
  // map or set
  if (isMap(value) || isSet(value)) {
    return !value.size;
  }
  // Object
  if (isPrototype(value)) {
    for (const key in Object(value)) {
      if (hasOwnProperty.call(value, key) && key !== 'constructor') {
        return false;
      }
    }
    return true;
  }
  // other
  for (const key in value as object) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}
