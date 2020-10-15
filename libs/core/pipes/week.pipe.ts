import { Pipe, PipeTransform } from '@angular/core';
import { isDate, SimDateAdapter, toDate } from '@ngx-simple/core/datetime';
import { isArray, isString } from '@ngx-simple/core/typeof';

/**
 * 日期周显示
 *
 * 支持日期字符串、时间戳字符串、时间戳、日期对象，如果日期解析失败会返回nul
 *
 * 注意：这里获取周使用`SimDateAdapter`的方法`getDayOfWeek`，0默认是周一，`Javascript`默认是周日。
 *
 * @example
 * 注意：示例中`new Date`在`Angular`模板是不允许的，这里为了简单的示例。
 *
 * {{ (new Date) | week }}
 * // 星期四
 *
 * {{ '2020-10-15' | week }}
 * // 星期四
 *
 * {{ '1602732040849' | week }}
 * // 星期四
 *
 * {{ 1602732040849 | week }}
 * // 星期四
 *
 * {{ (new Date('')) | week }}
 * // null
 */
@Pipe({ name: 'week' })
export class SimWeekPipe implements PipeTransform {
  constructor(private dateAdapter: SimDateAdapter<Date>) {}

  transform(value: null | undefined): null;
  transform(value: string | number | Date, args?: 'long' | 'short' | 'narrow' | string[]): string;
  transform(value: null | undefined | string | number | Date, args: 'long' | 'short' | 'narrow' | string[] = 'narrow'): string {
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
