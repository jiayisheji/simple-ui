import { Pipe, PipeTransform } from '@angular/core';
import { isArray, isBoolean, isNumber, isPlainObject, isString } from '@ngx-simple/core/typeof';

/**
 * 策略映射
 *
 * 值支持 `string|number|boolean` 映射对象支持 `[]|{}`
 *
 * 注意：
 *  1. 获取数据值 直接使用 `[][value]|{}[value]` 方式获取。
 *  2. 如果值是字符串，映射对象需要是`{}`。
 *  3. 如果值是数字，映射对象需要是`{}|[]`。
 *  4. 如果值是布尔会直接 `+value` 转换成数字，按数字处理方式。特别注意：0 => false, 1 => true
 *
 * @example
 *
 * {{ 1 | strategy: ['成功', '失败'] }}
 *
 * {{ 1 | strategy: {1: '成功', 2: '失败'} }}
 *
 * {{ 'ok' | strategy: {'ok': '成功', 'error': '失败'} }}
 *
 * {{ true | strategy: ['失败', '成功'] }}
 *
 * {{ false | strategy: {1: '成功', 0: '失败'} }}
 */
@Pipe({
  name: 'strategy'
})
export class StrategyPipe<R> implements PipeTransform {
  transform(value: null | undefined): null;
  transform(value: string): string;
  transform(value: number): number;
  transform(value: boolean): boolean;
  transform(value: boolean | number, args: R[] | { [key: number]: R }): R;
  transform(value: string, args: { [key: string]: R }): R;
  transform(
    value: null | undefined | string | number | boolean,
    args?: R[] | { [key: string]: R; [key: number]: R }
  ): R | string | number | boolean {
    // 处理异常情况
    if (value == null || value === '' || value !== value) {
      return null;
    }
    // 如果没有映射参数 直接返回原值
    if (args == null) {
      return value;
    }

    // 处理字符串
    if (isString(value)) {
      return this.mapperString(value, args as { [key: string]: R });
    }

    // 处理数字
    if (isNumber(value)) {
      return this.mapperNumber(value, args as { [key: string]: R });
    }

    // 处理布尔值
    if (isBoolean(value)) {
      return this.mapperNumber(+value, args as { [key: string]: R });
    }

    // 如果值不是字符串、数字、布尔值 直接返回原值
    return value;
  }

  private mapperNumber(value: number, args: R[] | { [key: number]: R }) {
    // 如果参数是基本类型数组[value1, value2] 或者 json对象类型 {key: value}
    if (isArray(args) || isPlainObject(args)) {
      return args[value];
    }
    return value;
  }

  private mapperString(value: string, args: { [key: string]: R }) {
    // 如果参数是json对象类型 {key: value}
    if (isPlainObject(args)) {
      return args[value];
    }
    return value;
  }
}
