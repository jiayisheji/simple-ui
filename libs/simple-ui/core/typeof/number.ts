import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { isObjectLike } from './object';
import { typeOf } from './type-of';

const numberTag = '[object Number]';

/**
 * 检查给定的参数是否是 number。
 * 使用typeof检查值是否为 number 类型。
 * 为了防止NaN，检查val === val(因为NaN 的类型是 number，并且是惟一不等于自身的值)。
 * @param val 任意值
 * @returns 如果指定值是number类型，并且不是NaN，则返回 true，否则返回 false。
 * @example
 *
 * isNumber(1);
 * // => true
 *
 * isNumber(Number.MIN_VALUE);
 * // => true
 *
 * isNumber(Infinity);
 * // => true
 *
 * isNumber('1');
 * // => false
 *
 * isNumber(+'a1');
 * // => false
 */
export function isNumber(val: SafeAny): val is number {
  return (typeof val === 'number' && val === val) || (isObjectLike(val) && typeOf(val) === numberTag);
}

/**
 * 检查给定的参数是否是整型数字。
 * 检查参数是否是数字，使用isFinite()检查数字是否有限。确保位处理以后等于自己。
 * @param val 任意值
 * @returns 如果指定值是整型数字类型，则返回 true，否则返回 false。
 * @example
 *
 * isInteger(5);
 * // => true
 *
 * isInteger(Number.MIN_VALUE);
 * // => true
 *
 * isInteger(Infinity);
 * // => false
 *
 * isInteger(Math.PI);
 * // => false
 *
 * isInteger('1');
 * // => false
 *
 * isInteger(NaN);
 * // => false
 *
 * isInteger(5.000000000000001);
 * // => false
 */
export function isInteger(val: SafeAny): val is number {
  return isNumber(val) && isFinite(val) && Math.floor(val) === val;
}
