import { assertArgs } from './assert';
import { isDate } from './is-date';

/**
 * 支持输入格式：
 * - `Date`
 * - number: timestamp
 * - string: 数字字符串（例如`"1234"`），ISO和日期字符串，
 */
export type ToDateType = Date | string | number;

export const ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
//    1        2       3         4          5          6          7          8  9     10      11
// /^(\d{4})[-\/]?(\d\d)[-\/]?(\d\d)(?:[\sT](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
/**
 * 将值转换为日期对象
 * @param value 传递要转换日期对象的值
 *
 * 支持输入格式：
 * - `Date`
 * - number: timestamp
 * - string: 数字字符串（例如`"1234"`），ISO和日期字符串，其格式由
 *   [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
 *   注意：没有时间的ISO字符串返回没有时间偏移的日期。
 *
 * 如果无法转换为日期，则抛出该异常。
 */
export function toDate(value: ToDateType): Date {
  assertArgs(1, arguments);
  // 如果是`undefined | null`是直接抛出类型错误异常
  // null => 1970年1月1日 08:00:00 GMT+0800
  // undefined => Invalid Date
  if (value == null) {
    throw new TypeError('"value" is null or not defined');
  }

  // 如果是时间对象，直接返回
  // 防止将日期传递给IE10中的`new Date()`时丢失毫秒
  if (isDate(value)) {
    return new Date(value.getTime());
  }

  // 如果是数字，那么就是时间戳 直接处理返回
  // NaN也是数字 它有个特性自己不等于自己
  if (typeof value === 'number' && !isNaN(value)) {
    return new Date(value);
  }
  // 如果是字符串
  // 1. 可能是字符串数字
  // 2. 可能是简单时间格式 2019-01-10 or 2019/01/10
  // 3. 可能是复杂格式
  if (typeof value === 'string') {
    value = value.trim();
    // 如果时间戳是字符串这个处理
    const parsedNb = parseFloat(value);
    // 任何仅包含数字的字符串，例如`"1234"`，但不包含`"1234hello"`
    if (!isNaN((value as any) - parsedNb)) {
      return new Date(parsedNb);
    }
    // 如果时间格式是yyyy-MM-dd 或者 yyyy/MM/dd 直接处理返回
    if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
      // 对于没有时间的ISO字符串，必须在创建日期之前从ISO字符串中提取日、月和年，以避免在新的日期中出现时间偏移和错误。
      // 如果我们只将ISO字符串(“2015,01,01”)中的'-'替换为'，'并尝试创建一个新的日期，一些浏览器(如ie9)会抛出一个无效的日期错误。
      // 如果我们保留'-'("2015-01-01")并尝试创建一个新的日期("2015-01-01")，时间偏移就会应用。
      // 注意:ISO月份为0表示1月，1表示2月，…
      const [y, m, d] = value.split('-').map(val => +val);
      return new Date(y, m - 1, d);
    }
    // 如果是复杂格式时间需要更多处理
    let match: RegExpMatchArray | null;
    if ((match = value.match(ISO8601_DATE_REGEX))) {
      return isoStringToDate(match);
    }
  }

  // 无法判断是什么格式，准备接受异常处理
  const date = new Date(value);
  if (isDate(date)) {
    return date;
  }
  return date;
}

/**
 * 将ISO8601中的日期转换为日期。由于浏览器差异而使用，而不是`Date.parse`
 */
export function isoStringToDate(match: RegExpMatchArray): Date {
  const date = new Date(0);
  let tzHour = 0;
  let tzMin = 0;

  // match[8] 表示字符串包含`"Z"(UTC)`或诸如`"+01:00"`或`"+0100"`的时区
  const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
  const timeSetter = match[8] ? date.setUTCHours : date.setHours;

  // 如果有定义的时区 "+01:00" 或 "+0100"
  if (match[9]) {
    tzHour = Number(match[9] + match[10]);
    tzMin = Number(match[9] + match[11]);
  }
  dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const h = Number(match[4] || 0) - tzHour;
  const m = Number(match[5] || 0) - tzMin;
  const s = Number(match[6] || 0);
  // ECMAScript规范 (https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.11)
  // 定义"DateTime"毫秒应始终四舍五入，以便`"999.9ms"`变为`"999ms"`。
  const ms = Math.floor(parseFloat('0.' + (match[7] || 0)) * 1000);
  timeSetter.call(date, h, m, s, ms);
  return date;
}
