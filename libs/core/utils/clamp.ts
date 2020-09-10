import { toNumber } from '@ngx-simple/core/coercion';

/**
 * 返回限制在 lower 和 upper 之间的值
 * @param number 被限制的值
 * @param lower 下限
 * @param upper 上限
 */
export function clamp(number: number, lower?: number, upper?: number) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }
  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}
