import { toDate, ToDateType } from './to-date';

/**
 * 给定的日期是否闰年
 * @param dirtyDate 给定日期
 * @returns 给定日期是闰年
 */
export function isLeapYear(dirtyDate: ToDateType): boolean {
  const date = toDate(dirtyDate);
  const year = date.getFullYear();
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}
