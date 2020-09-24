import { Pipe, PipeTransform } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';

export type Mapper<T, G> = (item: T, ...args: SafeAny[]) => G;

@Pipe({
  name: 'mapper'
})
export class SimMapperPipe<T, G> implements PipeTransform {
  transform(value: T, mapper: Mapper<T, G>, ...args: SafeAny[]): G {
    return mapper(value, ...args);
  }
}
