import { Pipe, PipeTransform } from '@angular/core';
import { isFunction } from '@ngx-simple/core/typeof';
import { SafeAny } from '@ngx-simple/core/types';

export type Mapper<T, G> = (item: T, ...args: SafeAny[]) => G;

/**
 * 映射器
 *
 * @example
 * {
 *   readonly value = 125;
 *   readonly max = 100;
 *   readonly canValue = Mapper<number, number> = (value: number, max: number) => Math.min(value, max);
 * }
 *
 * {{ value | mapper: canValue : max }}
 * // 100
 */
@Pipe({
  name: 'mapper'
})
export class SimMapperPipe<T, G> implements PipeTransform {
  transform(value: T, mapper: Mapper<T, G>, ...args: SafeAny[]): G {
    if (isFunction(mapper)) {
      return mapper(value, ...args);
    }
    return null;
  }
}
