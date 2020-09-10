import { SafeAny } from '@ngx-simple/core/types';
import { isObjectLike } from './object';
import { typeOf } from './type-of';

const boolTag = '[object Boolean]';

/**
 * @description 检查给定的参数是否是 boolean。
 * 使用typeof检查值是否为 boolean 类型。
 * @param value 任意值
 * @returns 如果指定值是boolean类型，则返回 true，否则返回 false。
 * @example
 *
 * isBoolean(false);
 * // => true
 *
 * isBoolean(null);
 * // => false
 */
export function isBoolean(value: SafeAny): value is boolean {
  return value === true || value === false || (isObjectLike(value) && typeOf(value) === boolTag);
}
