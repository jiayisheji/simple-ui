import { SafeAny } from '@ngx-simple/core/types';

export type Primitive = null | boolean | number | string | symbol;

/**
 * 检查给定的参数是否是原始的类型（null|boolean|number|string|symbol）。
 * 从value创建一个对象，并将其与value进行比较，以确定传递的值是否为原始(即不等于创建的对象)。
 * @param value 任意值
 * @returns 如果指定值为原始类型，则返回 true，否则返回 false。
 */
export function isPrimitive(value: SafeAny): value is Primitive {
  return Object(value) !== value;
}
