import { SafeAny } from '@ngx-simple/simple-ui/core/types';

/**
 * @description 检查给定的参数是否是 Promise。
 * 检查它的类型是否匹配对象，排除null，以及它是否具有.then函数和.catch函数。
 * @param val 任意值
 * @returns 如果指定值为Promise，则返回 true，否则返回 false。
 */
export function isPromise<T>(value: SafeAny): value is Promise<T> {
  return !!value && typeof value.then === 'function' && typeof value.catch === 'function';
}
