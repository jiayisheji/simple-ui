import { SafeAny } from '@ngx-simple/core/types';

/**
 * 描述数字输入的允许值。
 */
export type NumberInput = string | number | null | undefined;

/**
 * @description 将数据绑定值(通常是字符串)强制转换为数字
 * @export
 * @param value 任意值
 * @returns 返回数字
 */
export function toNumber(value: SafeAny): number;
export function toNumber<D>(value: SafeAny, fallback: D): number | D;
export function toNumber(value: SafeAny, fallbackValue = 0) {
  return _isNumberValue(value) ? Number(value) : fallbackValue;
}

/**
 * @description 检查所提供的值是否被认为是一个数字
 * @param value 任意值
 * @returns 如果是数字字符串返回true，否则返回false
 */
export function _isNumberValue(value: SafeAny): boolean {
  // parseFloat(value)处理我们感兴趣的大多数情况(它将null、空字符串和其他非数字值视为NaN，其中Number只使用0)，
  // 但是它认为字符串“123hello”是一个有效的数字。因此我们还要检查Number(value)是否为NaN。
  return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}
