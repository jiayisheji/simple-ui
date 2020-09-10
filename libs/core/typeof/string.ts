import { SafeAny } from '@ngx-simple/core/types';
import { isObjectLike } from './object';
import { typeOf } from './type-of';

const stringTag = '[object String]';

/**
 * @description 检查给定参数是否为string。只适用于string类型。
 * 使用typeof检查值是否为 string 类型。
 * @param value 任意值
 * @returns 如果指定值是string类型，则返回 true，否则返回 false。
 * @example
 *
 * isString('abc');
 * // => true
 *
 * isString(1);
 * // => false
 */
export function isString(value: SafeAny): value is string {
  return typeof value === 'string' || (isObjectLike(value) && typeOf(value) === stringTag);
}
