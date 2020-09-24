import { Pipe, PipeTransform } from '@angular/core';
import { isDate, SimDateAdapter, toDate } from '@ngx-simple/core/datetime';
import { isArray, isString } from '@ngx-simple/core/typeof';

@Pipe({ name: 'week' })
export class SimWeekPipe implements PipeTransform {
  constructor(private dateAdapter: SimDateAdapter<Date>) {}
  transform(value: string | number | Date, args: 'long' | 'short' | 'narrow' | string[] = 'narrow'): string {
    // 处理异常情况
    if (value == null || value === '' || value !== value) {
      return null;
    }
    let weekdays: string[];
    if (isString(args)) {
      weekdays = this.dateAdapter.getDayOfWeekNames(args);
    } else if (isArray(args) && args.length === 7) {
      weekdays = args as string[];
    } else {
      throw new Error(`${args} 请使用 'long' | 'short' | 'narrow' 或者自定义一周7天名称数组`);
    }
    // 尝试解析值为日期对象
    const date = toDate(value);
    if (!isDate(date)) {
      return null;
    }
    return weekdays[this.dateAdapter.getDayOfWeek(date)];
  }
}
