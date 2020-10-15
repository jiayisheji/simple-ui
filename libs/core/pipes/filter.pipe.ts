import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from '@ngx-simple/core/typeof';
import { SafeAny } from '@ngx-simple/core/types';

export type Matcher<T> = (item: T, ...args: SafeAny[]) => boolean;

/**
 * 数组过滤，参考 `Array.filter` 用法
 *
 * @example
 * {
 *   readonly items = [1, 3, 5, 10, 15, 25]
 *   readonly matcher = item => item % 5 === 0 && item < 20;
 * }
 *
 * <p *ngFor="let item of items | filter: matcher">{{item}}</p>
 */
@Pipe({
  name: 'filter'
})
export class SimFilterPipe<T> implements PipeTransform {
  transform(items: ReadonlyArray<T>, matcher: Matcher<T>, ...args: SafeAny[]): T[] {
    // 如果不是数组直接返回空数组 避免`Array.filter`出错
    if (items == null || !isArray(items)) {
      return [];
    }
    return items.filter(item => matcher(item, ...args));
  }
}
