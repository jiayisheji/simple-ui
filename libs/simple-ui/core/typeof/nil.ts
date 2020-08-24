import { SafeAny } from '../types';

/**
 * @description 检查给定参数是否为 undefined。
 * 使用typeof检查值是否为 undefined 类型。
 * @param val 任意值
 * @returns 如果指定值是undefined类型，则返回 true，否则返回 false。
 * @example
 *
 * isUndefined(void 0);
 * // => true
 *
 * isUndefined(null);
 * // => false
 */
export function isUndefined(val: SafeAny): val is undefined {
  return typeof val === 'undefined';
}

/**
 * @description 检查给定的参数是否是 null。
 * 使用严格的相等运算符检查 val 的值和值是否等于null。
 * @param val 任意值
 * @returns 如果指定值是null，则返回 true，否则返回 false。
 * @example
 *
 * isNull(null);
 * // => true
 *
 * isNull(void 0);
 * // => false
 */
export function isNull(val: SafeAny): val is null {
  return val === null;
}

/**
 * @description 检查给定的参数是否是 null 或 undefined。
 * 使用严格的相等运算符检查 val 的值和值是否等于 null或 undefined。
 * @param val 任意值
 * @returns 如果指定值为 null 或 undefined，则返回 true，否则返回 false。
 * @example
 *
 * isNil(null);
 * // => true
 *
 * isNil(void 0);
 * // => true
 *
 * isNil(NaN);
 * // => false
 */
export function isNil(val: SafeAny): val is undefined | null {
  return val == null;
}
