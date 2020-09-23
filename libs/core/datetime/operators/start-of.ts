import { toDate, ToDateType } from './to-date';

/**
 * 返回给定日期的年初
 * @param dirtyDate 给定日期
 * @returns 年初
 * @example
 * // 返回给定日期年初
 * const result = startOfYear(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-01-01 00:00:00
 */
export function startOfYear(dirtyDate: ToDateType): Date {
  const cleanDate = toDate(dirtyDate);
  const date = new Date(0);
  date.setFullYear(cleanDate.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 返回给定日期的年度季度开始
 * @param dirtyDate 给定日期
 * @returns 季度开始
 * @example
 * // 返回给定日期季度开始
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-10-01 00:00:00
 */
export function startOfQuarter(dirtyDate: ToDateType): Date {
  const date = toDate(dirtyDate);
  const currentMonth = date.getMonth();
  const month = currentMonth - (currentMonth % 3);
  date.setMonth(month, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 返回给定日期的一个月开始
 * @param dirtyDate 给定日期
 * @returns 一个月开始
 * @example
 * // 返回给定日期一个月开始
 * const result = endOfMonth(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-10-01 00:00:00
 */
export function startOfMonth(dirtyDate: ToDateType): Date {
  const date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 返回给定日期的一周开始
 * @param dirtyDate 给定日期
 * @param weekStartsOn 一星期第一天的指数(0-星期日)
 * @returns 一周开始
 * @example
 * // 返回给定日期一周开始
 * const result = startOfWeek(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-10-18 00:00:00
 * const result = startOfWeek(new Date(2020, 9, 18, 11, 55, 0), 1)
 * => 2020-10-12 00:00:00
 */
export function startOfWeek(dirtyDate: ToDateType, weekStartsOn: number = 0): Date {
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  const date = toDate(dirtyDate);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 返回给定日期的一天开始
 * @param dirtyDate 给定日期
 * @returns 一天开始
 * @example
 * // 返回给定日期一天开始
 * const result = startOfDay(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-10-01 00:00:00
 */
export function startOfDay(dirtyDate: ToDateType): Date {
  const date = toDate(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 返回给定日期的一个小时的开始
 * @param dirtyDate 给定日期
 * @returns 一个小时的开始
 * @example
 * // 返回给定日期一个小时的开始
 * const result = startOfHour(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-10-18 11:00:00
 */
export function startOfHour(dirtyDate: ToDateType): Date {
  const date = toDate(dirtyDate);
  date.setMinutes(0, 0, 0);
  return date;
}

/**
 * 返回给定日期的一分钟开始
 * @param dirtyDate 给定日期
 * @returns 一分钟开始
 * @example
 * // 返回给定日期一分钟开始
 * const result = startOfMinute(new Date(2020, 9, 18, 11, 55, 0))
 * => 2020-10-18 11:55:00
 */
export function startOfMinute(dirtyDate: ToDateType): Date {
  const date = toDate(dirtyDate);
  date.setSeconds(0, 0);
  return date;
}

/**
 * 返回给定日期的一秒钟开始
 * @param dirtyDate 给定日期
 * @returns 一秒钟开始
 * @example
 * // 返回给定日期一秒钟开始
 * const result = startOfSecond(new Date(2020, 9, 18, 11, 55, 22))
 * => 2020-10-18 11:55:22
 */
export function startOfSecond(dirtyDate: ToDateType): Date {
  const date = toDate(dirtyDate);
  date.setMilliseconds(0);
  return date;
}
