import { toDate } from './to-date';

/**
 * 返回给定日期的年底
 * @param dirtyDate 给定日期
 * @returns 年底
 * @example
 * // 返回给定日期年底
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-12-31 23:59:59.999
 */
export function endOfYear(dirtyDate: Date | string | number): Date {
  const date = toDate(dirtyDate);
  const year = date.getFullYear();
  date.setFullYear(year + 1, 0, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * 返回给定日期的季度末
 * @param dirtyDate 给定日期
 * @returns 季度末
 * @example
 * // 返回给定日期季度末
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-12-31 23:59:59.999
 */
export function endOfQuarter(dirtyDate: Date | string | number): Date {
  const date = toDate(dirtyDate);
  const currentMonth = date.getMonth();
  const month = currentMonth - (currentMonth % 3) + 3;
  date.setMonth(month, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * 返回给定日期的月底
 * @param dirtyDate 给定日期
 * @returns 月底
 * @example
 * // 返回给定日期月底
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-10-31 23:59:59.999
 */
export function endOfMonth(dirtyDate: Date | string | number): Date {
  const date = toDate(dirtyDate);
  const month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * 返回给定日期的周末
 * @param dirtyDate 给定日期
 * @param weekStartsOn 一星期第一天的指数(0-星期日)
 * @returns 周末
 * @example
 * // 返回给定日期周末
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-09-30 23:59:59.999
 */
export function endOfWeek(dirtyDate: Date | string | number, weekStartsOn: number = 0): Date {
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  const date = toDate(dirtyDate);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * 返回给定日期的一天结束
 * @param dirtyDate
 * @returns 一天结束
 * @example
 * // 返回给定日期一天结束
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-09-30 23:59:59.999
 */
export function endOfDay(dirtyDate: Date | string | number): Date {
  const date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * 返回给定日期的一小时结束
 * @param dirtyDate
 * @returns 一小时结束
 * @example
 * // 返回给定日期一小时结束
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-09-30 23:59:59.999
 */
export function endOfHour(dirtyDate: Date | string | number): Date {
  const date = toDate(dirtyDate);
  date.setMinutes(59, 59, 999);
  return date;
}

/**
 * 返回给定日期的一分钟结束
 * @param dirtyDate
 * @returns 一分钟结束
 * @example
 * // 返回给定日期一分钟结束
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-09-30 23:59:59.999
 */
export function endOfMinute(dirtyDate: Date | string | number): Date {
  const date = toDate(dirtyDate);
  date.setSeconds(59, 999);
  return date;
}

/**
 * 返回给定日期的一秒钟结束
 * @param dirtyDate
 * @returns 一秒钟结束
 * @example
 * // 返回给定日期一秒钟结束
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-09-30 23:59:59.999
 */
export function endOfSecond(dirtyDate: Date | string | number): Date {
  const date = toDate(dirtyDate);
  date.setMilliseconds(999);
  return date;
}
