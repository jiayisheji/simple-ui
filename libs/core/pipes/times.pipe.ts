import { Pipe, PipeTransform } from '@angular/core';
import { toNumber } from '@ngx-simple/core/coercion';
import { isLength } from '@ngx-simple/core/typeof';

/** 最大长度 */
const MAX_ARRAY_LENGTH = 4294967295;

@Pipe({
  name: 'times'
})
export class SimTimesPipe implements PipeTransform {
  transform(value: number): number[] {
    // 处理异常情况
    if (value == null || value !== value) {
      return null;
    }
    // 先把value转成数字
    value = toNumber(value);
    // 如果小于1或者大于限制就直接返回空数组
    if (!isLength(value) || value === 0) {
      return [];
    }
    // 获取长度
    const length = Math.min(value, MAX_ARRAY_LENGTH);

    let index = -1;
    const result: number[] = [];
    while (++index < length) {
      result[index] = index;
    }
    return result;
  }
}
