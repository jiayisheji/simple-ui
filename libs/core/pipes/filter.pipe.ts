import { Pipe, PipeTransform } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';

export type Matcher<T> = (item: T, ...args: SafeAny[]) => boolean;

@Pipe({
  name: 'filter'
})
export class SimFilterPipe<T> implements PipeTransform {
  transform(items: ReadonlyArray<T>, matcher: Matcher<T>, ...args: SafeAny[]): T[] {
    return items.filter(item => matcher(item, ...args));
  }
}
