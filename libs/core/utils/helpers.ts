import { toArray } from '@ngx-simple/core/coercion';
import { isArray, isNil, isNumber, isObject, isPlainObject, isString } from '@ngx-simple/core/typeof';
import { NumericDictionary, PropertyPath } from '@ngx-simple/core/types';

const hasOwnProperty = Object.prototype.hasOwnProperty;

function getPath(path: string | string[]): string[] {
  if (isArray(path)) {
    return path;
  }
  if (isString(path)) {
    return path
      .replace(/\[([^\[\]]*)\]/g, '.$1.')
      .split('.')
      .filter(t => t !== '');
  }
  return [path];
}

/**
 * 判断对象属性存在
 * @param object 任意{}对象
 * @param path 属性值 'string' | 'string.string' | ['string', 'string']
 * @returns 如果集合没有可枚举属性，或任何类型不被视为集合，则返回true。
 */
export function has<T extends object>(object: T, path: PropertyPath): boolean {
  return (
    !isNil(object) &&
    getPath(path as string).every(key => {
      if (typeof object !== 'object' || isNil(object) || !hasOwnProperty.call(object, key)) {
        return false;
      }
      object = object[key];
      return true;
    })
  );
}

/**
 * 根据key深度获取对象对应值
 * @param object 对象 [] | {}
 * @param path 属性值或者属性集合 'number' | 'string' | 'string.string' | ['string', 'string']
 * @param fallback 回退值
 * @returns 返回实际值，如果取不到返回null
 */
export function get<T extends object, K extends keyof T>(object: T, path: K | K[]): T[K];
export function get<T extends object, K extends keyof T>(object: T, path: K | K[]): T[K] | undefined;
export function get<T extends object, D>(object: T | null | undefined, path: PropertyPath, fallback: D): T | D;
export function get<T>(object: NumericDictionary<T>, path: number): T;
export function get<T>(object: NumericDictionary<T>, path: number): T | undefined;
export function get<T, D>(object: NumericDictionary<T>, path: number, fallback: D): T | D;
export function get<D>(object: null | undefined, path: PropertyPath, fallback: D): D;
export function get<T extends object>(object: T | null | undefined, path: PropertyPath): undefined;
export function get<T extends object, K extends keyof T, D>(object: T, path: K | K[], fallback: D): T[K] | D;
export function get<T extends object, K extends keyof T, D>(
  object: T | NumericDictionary<T> | null | undefined,
  path: K | K[] | PropertyPath,
  fallback?: D
): T[K] | T | D | undefined {
  // 如果是 null | undefined 直接返回 fallback， 默认它是 undefined
  if (isNil(object)) {
    return fallback;
  }
  // 如果是object直接返回 只处理array和{}；
  if (!isObject(object)) {
    return object;
  }
  // 优先处理数组
  if (isArray(object)) {
    if (isNumber(path)) {
      return object[path] || fallback;
    }
    return undefined;
  } else {
    const result = getPath(path as string | string[]).reduce((prev: T, cur) => prev && prev[cur], object) as T[K];
    return result || fallback;
  }
}

/**
 * 根据属性集合排除对象值
 * @param obj 对象
 * @param arr 属性值或者属性集合
 * @returns 返回排除属性值以外的对象属性和值
 */
export function omit<T extends object, K extends keyof T>(object: T, path: K | K[]): Omit<T, K> {
  // 只处理 {}
  if (!isPlainObject(object)) {
    return object;
  }
  const paths = toArray(path);

  return Object.keys(object)
    .filter(k => !paths.includes(k as K))
    .reduce((acc, key) => ((acc[key as Exclude<keyof T, K>] = object[key as Exclude<keyof T, K>]), acc), {} as Omit<T, K>);
}

/**
 * 根据属性集合获取对象值
 * @param object 对象
 * @param arr 属性值或者属性集合
 * @returns 返回给定属性值以内的对象属性和值
 */
export function pick<T extends object, K extends keyof T>(object: T, prop: K | K[]): Pick<T, K> {
  // 只处理 {}
  if (!isPlainObject(object)) {
    return object;
  }
  return toArray(prop).reduce((acc, curr: K) => (hasOwnProperty.call(object, curr) && (acc[curr] = object[curr]), acc), {} as Pick<T, K>);
}
