import { Injectable } from '@angular/core';
import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { SimDateAdapter, SimDateStyleName, SimDateUnitName } from './date-adapter';

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

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  compareDate(first: Date, second: Date): number {
    return (
      this.getYear(first) - this.getYear(second) ||
      this.getMonth(first) - this.getMonth(second) ||
      this.getDate(first) - this.getDate(second) ||
      this.getHours(first) - this.getHours(second) ||
      this.getMinutes(first) - this.getMinutes(second) ||
      this.getSeconds(first) - this.getSeconds(second)
    );
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
    if (typeof value === 'string') {
      if (!value) {
        return null;
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

  endOf(date: Date, unit: SimDateUnitName): Date {
    let month = 11;
    let day = 31;
    let hour = 23;
    let minute = 59;
    let second = 59;

    switch (unit) {
      case 'quarter':
        const newDate = this.clone(date);
        // "1 2 3 4 5 6 7 8 9 10 11 12".split(' ').map(i => +i + 3 - (i % 3 || 3) - 1)
        // [2, 2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11]
        month = this.getMonth(date) + 1;
        month = month + 3 - (month % 3 || 3) - 1;
        // 把获取季度最后一个设置给拷贝的时间
        newDate.setMonth(month);
        // 重新获取月份和日期
        month = this.getMonth(newDate);
        day = this.getNumDaysInMonth(newDate);
        break;
      case 'month':
        month = this.getMonth(date);
        day = this.getNumDaysInMonth(date);
        break;
      case 'week':
        month = this.getMonth(date);
        day = this.getDate(date) + ((this.getFirstDayOfWeek() + 6 - this.getDayOfWeek(date) + 7 * 1) % 7);
        break;
      case 'day':
        month = this.getMonth(date);
        day = this.getDate(date);
        break;
      case 'hour':
        month = this.getMonth(date);
        day = this.getDate(date);
        hour = this.getHours(date);
        break;
      case 'minute':
        month = this.getMonth(date);
        day = this.getDate(date);
        hour = this.getHours(date);
        minute = this.getMinutes(date);
        break;
      case 'second':
        month = this.getMonth(date);
        day = this.getDate(date);
        hour = this.getHours(date);
        minute = this.getMinutes(date);
        second = this.getSeconds(date);
        break;
    }

    return this._createDateWithOverflow(this.getYear(date), month, day, hour, minute, second, 999);
  }

  format(date: Date, displayFormat: string = 'yyyy-MM-dd'): string {
    if (!this.isValid(date)) {
      throw Error('NativeDateAdapter: Cannot format invalid date.');
    }
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
    // 中国星期一是一周第一天
    return 1;
  }

  getFirstDayOfWeekInMonth(date: Date): number {
    return this.getDayOfWeek(this.startOf(date, 'month'));
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
    const firstDayOfYear = this.startOf(date, 'year').getTime() + this.getFirstDayOfWeek() * ONE_DAY_MILLISECONDS;
    const toDay = this.startOf(date, 'day').getTime() + this.getFirstDayOfWeek() * ONE_DAY_MILLISECONDS;
    return Math.ceil((toDay - firstDayOfYear) / (ONE_DAY_MILLISECONDS * 7));
  }

  getValidDateOrNull(obj: SafeAny): Date | null {
    return this.isDateInstance(obj) && this.isValid(obj) ? obj : null;
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

  parse(value: SafeAny): Date | null {
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

  startOf(date: Date, unit: SimDateUnitName): Date {
    let month = 0;
    let day = 1;
    let hour = 0;
    let minute = 0;
    let second = 0;

    switch (unit) {
      case 'quarter':
        // "1 2 3 4 5 6 7 8 9 10 11 12".split(' ').map(i => +i - (i % 3 || 3))
        // [0, 0, 0, 3, 3, 3, 6, 6, 6, 9, 9, 9]
        month = this.getMonth(date) + 1;
        month = month - (month % 3 || 3);
        break;
      case 'month':
        month = this.getMonth(date);
        break;
      case 'week':
        month = this.getMonth(date);
        // 一周七天 getFirstDayOfWeek =》 一周从哪天开始 js默认0 周日 获取当前星期
        day = this.getDate(date) + ((this.getFirstDayOfWeek() - this.getDayOfWeek(date) + 7 * -1) % 7);
        break;
      case 'day':
        month = this.getMonth(date);
        day = this.getDate(date);
        break;
      case 'hour':
        month = this.getMonth(date);
        day = this.getDate(date);
        hour = this.getHours(date);
        break;
      case 'minute':
        month = this.getMonth(date);
        day = this.getDate(date);
        hour = this.getHours(date);
        minute = this.getMinutes(date);
        break;
      case 'second':
        month = this.getMonth(date);
        day = this.getDate(date);
        hour = this.getHours(date);
        minute = this.getMinutes(date);
        second = this.getSeconds(date);
        break;
    }

    return this._createDateWithOverflow(this.getYear(date), month, day, hour, minute, second);
  }

  toDate(obj: SafeAny): Date | null {
    return this.getValidDateOrNull(obj);
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
}
