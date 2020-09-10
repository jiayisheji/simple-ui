import { toBoolean, toNumber } from '@ngx-simple/core/coercion';
import { ValueHook } from './value-hook';

/**
 * 处理 `@Input` boolean 类型属性
 */
export function InputBoolean<T, K extends keyof T>() {
  return ValueHook<T, K>(function (key: symbol, value: T[K]) {
    this[key] = toBoolean(value);
    return false;
  });
}

/**
 * 处理 `@Input` number 类型属性
 */
export function InputNumber<T, K extends keyof T>(fallbackValue: number = 0) {
  return ValueHook<T, K>(function (key: symbol, value: T[K]) {
    this[key] = toNumber(value, fallbackValue);
    return false;
  });
}
