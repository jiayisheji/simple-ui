import { SafeAny } from '@ngx-simple/core/types';
import { isObject } from './object';
import { typeOf } from './type-of';

const asyncTag = '[object AsyncFunction]';
const funcTag = '[object Function]';
const genTag = '[object GeneratorFunction]';
const proxyTag = '[object Proxy]';

/**
 * @description 检查给定的参数是否是 function。
 * 使用typeof检查值是否为 function 类型。
 * @param value 任意值
 * @returns 如果指定值是function类型，则返回 true，否则返回 false。
 * @example
 *
 * isFunction(() => {});
 * // => true
 *
 * isFunction(/abc/);
 * // => false
 */
export function isFunction(value: SafeAny): value is (...reset: SafeAny[]) => SafeAny {
  if (!isObject(value)) {
    return false;
  }
  const tag = typeOf(value);
  return typeof value === 'function' || tag === funcTag || tag === genTag || tag === asyncTag || tag === proxyTag;
}
