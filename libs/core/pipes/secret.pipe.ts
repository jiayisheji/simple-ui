import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secret'
})
export class SimSecretPipe implements PipeTransform {
  private shield = '*';
  transform(value: string, ...args: number[]): string {
    // 处理异常情况
    if (value == null || value === '') {
      return null;
    }
    const length = value.length;
    if (args.length === 0) {
      return new Array(length + 1).join(this.shield);
    }
    // 处理多个组合
    let index = 0;
    let min = 0;
    const pairs: number[][] = args.reduce(
      (arr, arg) => {
        // 要小于
        if (min > arg) {
          return arr;
        }
        if (arr[index].length === 2) {
          arr.push([arg]);
          index++;
        } else {
          arr[index].push(arg);
        }
        min = arg;
        return arr;
      },
      [[]]
    );
    if (pairs[index].length !== 2) {
      pairs[index].push(length);
    }
    // 拼接字符串
    let result = '';
    let i = -1;
    while (++i < length) {
      if (pairs.some(([m, n]) => m <= i && i <= n)) {
        result += this.shield;
      } else {
        result += value[i];
      }
    }
    return result;
  }
}
