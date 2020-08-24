import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { typeOf } from './type-of';

/**
 * @description 检查给定的参数是否是 object。
 * 如果值为null或undefined，则返回一个false
 * 如果值为function，则返回一个true
 * @param value 任意值
 * @returns 如果指定值为object，则返回 true，否则返回 false。
 * @example
 *
 * isObject({});
 * // => true
 *
 * isObject([]);
 * // => true
 *
 * isObject(() => {});
 * // => true
 *
 * isObject(null);
 * // => false
 */
export function isObject(value: SafeAny): value is object {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  const type = typeof value;
  return !!value && (type === 'object' || type === 'function');
}

/**
 * @description 检查值是否为object-like。
 * 例如 JSON Array Date RegExp Map Set...
 * 检查提供的值是否不为null，其类型是否等于'object'。
 * @param value 任意值
 * @returns 如果指定值为object，则返回 true，否则返回 false。
 * @example
 *
 * isObjectLike({});
 * // => true
 *
 * isObjectLike([]);
 * // => true
 *
 * isObjectLike(() => {});
 * // => true
 *
 * isObjectLike(null);
 * // => false
 */
export function isObjectLike(value: SafeAny): value is object {
  return typeof value === 'object' && value !== null;
}

const objectTag = '[object Object]';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const funcToString = Function.prototype.toString;
const objectCtorString = funcToString.call(Object);

/**
 * @description 检查提供的值是否为对象构造函数创建的对象。
 * 检查提供的值是否为true，使用typeof检查它是否是一个 object 和 Object.constructor，以确保构造函数等于Object。
 * @param value 任意值
 * @returns 如果指定值为对象构造函数创建的对象，则返回 true，否则返回 false。
 * @example
 *
 * isPlainObject({});
 * // => true
 *
 * isPlainObject(Object.create(null));
 * // => true
 *
 * isPlainObject([]);
 * // => false
 *
 * isPlainObject(new Error);
 * // => false
 */
export function isPlainObject<T = object>(value: SafeAny): value is T {
  // 如果不是对象或者null直接返回 也不需要处理function类型
  if (!isObjectLike(value) || typeOf(value) !== objectTag) {
    return false;
  }
  // 获取原型如果没有直接返回true
  const proto = Object.getPrototypeOf(Object(value));
  if (proto === null) {
    return true;
  }
  const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
}

const regexpTag = '[object RegExp]';

/**
 * 检查是否 RegExp 对象类型
 * @param value 任意值
 * @returns 如果指定值为 [object RegExp]，则返回 true，否则返回 false。
 * @example
 *
 * isDate(/abc/);
 * // => true
 *
 * isDate('/abc/');
 * // => false
 */
export function isRegExp(value: SafeAny): value is RegExp {
  return isObjectLike(value) && typeOf(value) === regexpTag;
}

const dateTag = '[object Date]';

/**
 * 检查是否 Date 对象类型
 * @param value 任意值
 * @returns 如果指定值为 [object Date]，则返回 true，否则返回 false。
 * @example
 *
 * isDate(new Date);
 * // => true
 *
 * isDate('Sat Aug 22 2020');
 * // => false
 */
export function isDate(value: SafeAny): value is Date {
  return isObjectLike(value) && typeOf(value) === dateTag;
}

const domExcTag = '[object DOMException]';
const errorTag = '[object Error]';

/**
 * 检查是否 Error 对象类型
 * @param value 任意值
 * @returns 如果指定值为 [object Error]，则返回 true，否则返回 false。
 * @example
 *
 * isError(new Error);
 * // => true
 *
 * isError(Error);
 * // => false
 */
export function isError(value: SafeAny): value is Error {
  if (!isObjectLike(value)) {
    return false;
  }
  const tag = typeOf(value);
  return (
    tag === errorTag ||
    tag === domExcTag ||
    (typeof (value as Error).message === 'string' && typeof (value as Error).name === 'string' && !isPlainObject(value))
  );
}

const mapTag = '[object Map]';

/**
 * 检查是否 Map 对象类型
 * @param value 任意值
 * @returns 如果指定值为 [object Map]，则返回 true，否则返回 false。
 * @example
 *
 * isMap(new Map);
 * // => true
 *
 * isMap(new WeakMap);
 * // => false
 */
export function isMap(value: SafeAny): value is Map<SafeAny, SafeAny> {
  return isObjectLike(value) && typeOf(value) === mapTag;
}

const setTag = '[object Set]';

/**
 * 检查是否 Set 对象类型
 * @param value 任意值
 * @returns 如果指定值为 [object Set]，则返回 true，否则返回 false。
 * @example
 *
 * isSet(new Set);
 * // => true
 *
 * isSet(new WeakSet);
 * // => false
 */
export function isSet(value: SafeAny): value is Set<SafeAny> {
  return isObjectLike(value) && typeOf(value) === setTag;
}

const weakMapTag = '[object WeakMap]';

/**
 * 检查是否 Map 对象类型
 * @param value 任意值
 * @returns 如果指定值为 [object WeakMap]，则返回 true，否则返回 false。
 * @example
 *
 * isWeakMap(new WeakMap);
 * // => true
 *
 * isWeakMap(new Map);
 * // => false
 */
export function isWeakMap(value: SafeAny): value is WeakMap<SafeAny, SafeAny> {
  return isObjectLike(value) && typeOf(value) === weakMapTag;
}

const weakSetTag = '[object WeakSet]';

/**
 * 检查是否 Set 对象类型
 * @param value 任意值
 * @returns 如果指定值为 [object WeakSet]，则返回 true，否则返回 false。
 * @example
 *
 * isWeakSet(new WeakSet);
 * // => true
 *
 * isWeakSet(new Set);
 * // => false
 */
export function isWeakSet(value: SafeAny): value is WeakSet<SafeAny> {
  return isObjectLike(value) && typeOf(value) === weakSetTag;
}
