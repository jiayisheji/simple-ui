import { isArray, isSymbol } from '@ngx-simple/core/typeof';
import { SafeAny } from '@ngx-simple/core/types';

const INFINITY = 1 / 0;
const symbolProto = Symbol ? Symbol.prototype : undefined,
  symbolToString = symbolProto ? symbolProto.toString : undefined;
/**
 * 将任意值转成字符串
 */
export function toString<T>(value: SafeAny): string {
  return value == null ? '' : baseToString(value);
}

function baseToString(value: SafeAny): string {
  if (typeof value === 'string') {
    return value;
  }

  if (isArray(value)) {
    return arrayMap(value, baseToString) + '';
  }

  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }

  const result = value + '';
  return result === '0' && 1 / value === -INFINITY ? '-0' : result;
}

function arrayMap(array: SafeAny, iteratee: SafeAny) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  const result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
