import { Pipe, PipeTransform } from '@angular/core';
import { toNumber } from '@ngx-simple/core/coercion';
import { isArray, isPlainObject } from '@ngx-simple/core/typeof';

@Pipe({
  name: 'strategy'
})
export class StrategyPipe<R> implements PipeTransform {
  transform(value: string | number, args?: R[] | { [key: string]: R; [key: number]: R }): R {
    // 处理异常情况
    if (value == null || value === '' || value !== value) {
      return null;
    }
    // 如果有参数
    if (args == null) {
      return null;
    }
    // 如果参数是基本类型数组[value1, value2] 值是可以转成数字
    if (isArray(args)) {
      value = toNumber<number>(value, null);
      if (value == null) {
        return null;
      }
      return args[value];
    }
    // 如果参数是json对象类型 {key: value} 值是字符串
    if (isPlainObject(args)) {
      return args[value];
    }
    return null;
  }
}
