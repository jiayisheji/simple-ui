import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { isObjectLike } from './object';
import { typeOf } from './type-of';

const symbolTag = '[object Symbol]';
/**
 * @description 检查给定参数是否为 symbol。
 * 使用typeof检查值是否为 symbol 类型。
 * @param value 任意值
 * @returns 如果指定值是symbol类型，则返回 true，否则返回 false。
 * @example
 *
 * isSymbol(Symbol.iterator);
 * // => true
 *
 * isSymbol(Symbol('isSymbol'));
 * // => true
 *
 * isSymbol('abc');
 * // => false
 */
export function isSymbol(value: SafeAny): value is symbol {
  return typeof value === 'symbol' || (isObjectLike(value) && typeOf(value) === symbolTag);
}
