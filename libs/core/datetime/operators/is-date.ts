import { assertArgs } from './assert';

/**
 * 判断值是否是Date对象
 * @param value
 */
export function isDate(value: unknown): value is Date {
  assertArgs(1, arguments);
  return value instanceof Date && !isNaN(value.valueOf());
}
