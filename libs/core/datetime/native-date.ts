import { Injectable } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { SimDateAdapter, SimDateStyleName } from './date-adapter';
import { startOfDay, startOfMonth, startOfYear } from './operators';

/**
 * 月份
 */
export const DEFAULT_MONTH_NAMES = {
  long: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  short: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  narrow: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
};

/**
 * 周
 */
export const DEFAULT_DAY_OF_WEEK_NAMES = {
  long: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  short: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  narrow: ['一', '二', '三', '四', '五', '六', '日']
};

// 一天毫秒数 24*60*60*1000
export const ONE_DAY_MILLISECONDS = 86400000;
// 一小时毫秒数 24*60*1000
export const ONE_HOUR_MILLISECONDS = 1440000;
// 一分钟毫秒数 60*1000
export const ONE_MINUTE_MILLISECONDS = 60000;
// 一秒钟毫秒数 1000
export const ONE_SECOND_MILLISECONDS = 1000;

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

@Injectable()
export class SimNativeDate extends SimDateAdapter<Date> {
  addDays(date: Date, days: number): Date {
    return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
  }

  addMonths(date: Date, months: number): Date {
    const newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
    /**
     * 如果原始月份的天数比新月份多，则有可能在错误的月份结束。
     * 在这种情况下，我们要转到所需月份的最后一天。
     * 注意：额外的 +12％12 可以确保我们以正数结尾，因为JS％不能保证这一点。
     */
    if (this.getMonth(newDate) !== (((this.getMonth(date) + months) % 12) + 12) % 12) {
      return this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
    }
    return newDate;
  }

  addYears(date: Date, years: number): Date {
    return this.addMonths(date, years * 12);
  }

  clampDate(date: Date, min?: Date | null, max?: Date | null): Date {
    if (min && this.compareDate(date, min) < 0) {
      return min;
    }
    if (max && this.compareDate(date, max) > 0) {
      return max;
    }
    return date;
  }

  clampDatetime(date: Date, min?: Date | null, max?: Date | null): Date {
    if (min && this.compareDatetime(date, min) < 0) {
      return min;
    }
    if (max && this.compareDatetime(date, max) > 0) {
      return max;
    }
    return date;
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  compareDate(first: Date, second: Date): number {
    return (
      this.getYear(first) - this.getYear(second) ||
      this.getMonth(first) - this.getMonth(second) ||
      this.getDate(first) - this.getDate(second)
    );
  }

  compareDatetime(first: Date, second: Date): number {
    return first.getTime() - second.getTime();
  }

  createDate(
    year: number,
    month: number,
    date: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0
  ): Date {
    /** 检查无效的月份和日期，小时，分钟，秒钟，毫秒 */
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    if (hours < 0 || hours > 23) {
      throw Error(`Invalid hours "${hours}". hours has to be between 0 and 23.`);
    }

    if (minutes < 0 || minutes > 59) {
      throw Error(`Invalid minutes "${minutes}". minutes has to be between 0 and 23.`);
    }

    if (seconds < 0 || seconds > 59) {
      throw Error(`Invalid seconds "${seconds}". seconds has to be between 0 and 23.`);
    }

    if (milliseconds < 0 || milliseconds > 999) {
      throw Error(`Invalid milliseconds "${milliseconds}". milliseconds has to be greater than -1.`);
    }

    const newDate = this._createDateWithOverflow(year, month, date, hours, minutes, seconds, milliseconds);

    /** 检查日期是否未超过该月的上限，导致该月溢出 */
    if (newDate.getMonth() !== month) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return newDate;
  }

  deserialize(value: SafeAny) {
    // 如果是数字，那么就是时间戳 直接处理返回
    // NaN也是数字 它有个特性自己不等于自己
    if (typeof value === 'number' && value === value) {
      const date = new Date(value);
      if (this.isValid(date)) {
        return date;
      }
    }
    if (typeof value === 'string') {
      // 如果是字符串
      // 1. 可能是字符串数字
      // 2. 可能是简单时间格式 2019-01-10 or 2019/01/10
      // 3. 可能是复杂格式
      value = value.trim();

      if (!value) {
        return null;
      }

      // 处理时间戳字符串
      const parsedNumber = +value;
      // 任何只包含数字的字符串，如“1234”，但不包括“1234hello”
      if (!isNaN(((value as unknown) as number) - parsedNumber)) {
        const date = new Date(value);
        if (this.isValid(date)) {
          return date;
        }
      }

      if (ISO_8601_REGEX.test(value)) {
        const date = new Date(value);
        if (this.isValid(date)) {
          return date;
        }
      }
    }
    return super.deserialize(value);
  }

  format(date: Date, displayFormat: string = 'yyyy-MM-dd'): string {
    if (!this.isValid(date)) {
      throw Error('NativeDateAdapter: Cannot format invalid date.');
    }
    return this._format(date, displayFormat || 'yyyy-MM-dd');
  }

  getDate(date: Date): number {
    return date.getDate();
  }

  getDayOfWeek(date: Date): number {
    const weekEnd = this.getFirstDayOfWeek() ? 7 : 0;
    return (date.getDay() || weekEnd) - (weekEnd ? 1 : 0);
  }

  getDayOfWeekNames(style: SimDateStyleName): string[] {
    return DEFAULT_DAY_OF_WEEK_NAMES[style];
  }

  getFirstDayOfWeek(): number {
    // 原生JS日期的第一天默认是星期天。
    // 一般中国日历星期一是一周第一天
    return 1;
  }

  getFirstDayOfWeekInMonth(date: Date): number {
    return this.getDayOfWeek(startOfMonth(date));
  }

  getHours(date: Date): number {
    return date.getHours();
  }

  getMinutes(date: Date): number {
    return date.getMinutes();
  }

  getMonth(date: Date): number {
    return date.getMonth();
  }

  getSeconds(date: Date): number {
    return date.getSeconds();
  }

  getMonthNames(style: SimDateStyleName): string[] {
    return DEFAULT_MONTH_NAMES[style];
  }

  getNumDaysInMonth(date: Date): number {
    return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
  }

  getNumWeekInYear(date: Date): number {
    const firstDayOfYear = startOfYear(date).getTime() + this.getFirstDayOfWeek() * ONE_DAY_MILLISECONDS;
    const toDay = startOfDay(date).getTime() + this.getFirstDayOfWeek() * ONE_DAY_MILLISECONDS;
    return Math.ceil((toDay - firstDayOfYear) / (ONE_DAY_MILLISECONDS * 7));
  }

  getYear(date: Date): number {
    return date.getFullYear();
  }

  invalid(): Date {
    return new Date(NaN);
  }

  isDateInstance(obj: SafeAny): obj is Date {
    return obj instanceof Date;
  }

  isValid(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  parse(value: string | number): Date | null {
    if (typeof value === 'number') {
      return new Date(value);
    }
    return value ? new Date(Date.parse(value)) : null;
  }

  sameDate(first: Date | null, second: Date | null): boolean {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareDate(first, second);
      }
      return firstValid === secondValid;
    }
    return first === second;
  }

  sameDatetime(first: Date | null, second: Date | null): boolean {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareDatetime(first, second);
      }
      return firstValid === secondValid;
    }
    return first === second;
  }

  toIso8601(date: Date): string {
    return [date.getUTCFullYear(), this._2digit(date.getUTCMonth() + 1), this._2digit(date.getUTCDate())].join('-');
  }

  today(): Date {
    return new Date();
  }

  private _2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  private _createDateWithOverflow(
    year: number,
    month: number,
    date: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0
  ) {
    const result = new Date(year, month, date, hours, minutes, seconds, milliseconds);

    /** JS new Date() 将[0，99]范围内的年份视为19xx的缩写 */
    if (year >= 0 && year < 100) {
      result.setFullYear(this.getYear(result) - 1900);
    }
    return result;
  }

  private _format(date: Date, displayFormat: string) {
    const makeReg = (value: number | string): RegExp => new RegExp(`(${value})`);
    const keys: string[] = ['M+', 'd+', 'H+', 'm+', 's+', 'q+', 'S'];
    const values: number[] = [
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      Math.floor((date.getMonth() + 3) / 3),
      date.getMilliseconds()
    ];

    if (/(y+)/.test(displayFormat)) {
      displayFormat = displayFormat.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    let len = 0;
    let key: string;
    let val: number;
    while (len < keys.length) {
      key = keys[len];
      val = values[len];
      if (makeReg(key).test(displayFormat)) {
        displayFormat = displayFormat.replace(RegExp.$1, RegExp.$1.length === 1 ? val + '' : this._2digit(val));
      }
      len++;
    }
    return displayFormat;
  }
}
