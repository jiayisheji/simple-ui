import { SafeAny } from '@ngx-simple/core/types';
import { isFunction } from './function';
import { isNumber } from './number';

/**
 * 最大安全的整数 对应于`Number.MAX_SAFE_INTEGER`。
 * 由于不稳定的浏览器支持，以及没有在闭包类型中定义值，因此移出到这里的变量中。
 */
export const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * @description 检查给定的参数是否是 array。
 * 使用Array.isArray检查值是否为 array 类型。
 * @param val 任意值
 * @returns 如果指定值为array，则返回 true，否则返回 false。
 * @example
 *
 * isArray([]);
 * // => true
 *
 * isArray('123');
 * // => false
 */
export function isArray(val: SafeAny): val is SafeAny[] {
  return Array.isArray(val);
}

/**
 * @description 检查提供的参数是否类似于数组(即是可迭代的)。
 * 比如 字符串 dom集合 等
 * @param val 任意值
 * @returns 检查提供的参数是否不为 null，以及它的 Symbol.iterator 属性是一个函数。
 * @example
 *
 * isArrayLike('123');
 * // => true
 *
 * isArrayLike([]);
 * // => false
 */
export function isArrayLike(val: SafeAny): val is ArrayLike<SafeAny> {
  return val != null && !isFunction(val) && isLength(val.length);
}

/**
 * @description 检查提供的参数是否合法length
 * @param val 任意值
 * @returns 检查提供的参数是否不为 null，以及它的 Symbol.iterator 属性是一个函数。
 * @example
 *
 * isLength(123);
 * // => true
 *
 * isLength(MAX_SAFE_INTEGER + 1);
 * // => false
 */
export function isLength(val: SafeAny): val is number {
  return isNumber(val) && val > -1 && val % 1 === 0 && val <= MAX_SAFE_INTEGER;
}
