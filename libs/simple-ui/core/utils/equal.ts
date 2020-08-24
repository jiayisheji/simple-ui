import { isArray, isObjectLike, typeOf } from '@ngx-simple/simple-ui/core/typeof';
import { SafeAny } from '@ngx-simple/simple-ui/core/types';

const objectTag = '[object Object]';
const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const mapTag = '[object Map]';
const numberTag = '[object Number]';
const regexpTag = '[object RegExp]';
const setTag = '[object Set]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const argsTag = '[object Arguments]';

/** 用于将Symbol转换为原始类型和字符串 */
const symbolProto = Symbol ? Symbol.prototype : undefined;
const symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
/**
 * @description 判断两个值是否相等
 * 支持 undefined null number string NaN Object Map Set Array 不区分 +0 or -0
 * @param value 要比较的值
 * @param other 要比较的另一个值
 * @returns 两个值相等为true，否则为false
 * @example
 *
 * const object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
export function isEqual(value: SafeAny, other: SafeAny): boolean {
  return baseIsEqual(value, other);
}

/**
 * `isEqual`的基本实现。它支持部分比较和跟踪遍历的对象。
 * @param value 要比较的值
 * @param other 要比较的另一个值
 * @param stack 跟踪遍历的“value”和“other”对象。
 */
function baseIsEqual(value: SafeAny, other: SafeAny, seen?: WeakSet<SafeAny>, stack?: WeakMap<SafeAny, SafeAny>) {
  if (value === other) {
    return true;
  }
  // NaN
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  // 引用类型 需要特殊处理
  return baseIsEqualDeep(value, other, baseIsEqual, seen, stack);
}

function baseIsEqualDeep(
  value: SafeAny,
  other: SafeAny,
  equalFunc: (value: SafeAny, other: SafeAny, seen?: WeakSet<SafeAny>, stack?: WeakMap<SafeAny, SafeAny>) => boolean,
  seen?: WeakSet<SafeAny>,
  stack?: WeakMap<SafeAny, SafeAny>
) {
  const valTag = typeOf(value);
  const othTag = typeOf(other);
  const isSameTag = valTag === othTag;
  // 类型不相等 直接返回
  if (!isSameTag) {
    return false;
  }
  // 处理数组 "[object Array]"
  if (isArray(value)) {
    return equalArray(value, other, equalFunc, seen, stack || (stack = new WeakMap()));
  }

  // 处理 "[object Object]" 和 "[object Arguments]"
  if (valTag === objectTag || valTag === argsTag) {
    return equalObject(value, other, equalFunc, seen, stack || (stack = new WeakMap()));
  }
  // 处理其他对象类型  "[object Boolean]" "[object Date]" "[object String]" "[object RegExp]" "[object Error]" "[object Map]" "[object Set]"
  return equalTag(value, other, valTag, equalFunc, seen, stack || (stack = new WeakMap()));
}
/** 处理数组 */
function equalArray(
  array: SafeAny,
  other: SafeAny,
  equalFunc: (value: SafeAny, other: SafeAny, seen?: WeakSet<SafeAny>, stack?: WeakMap<SafeAny, SafeAny>) => boolean,
  seen?: WeakSet<SafeAny>,
  stack?: WeakMap<SafeAny, SafeAny>
) {
  const arrLength = array.length;
  const othLength = other.length;
  // 如果数组长度不相等 直接返回false
  if (arrLength !== othLength) {
    return false;
  }
  // 假设循环值相等
  const stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked === other;
  }
  // 递归地比较对象(容易受到调用堆栈限制的影响)
  stack.set(array, other);
  stack.set(other, array);
  let index = -1;
  let result = true;
  while (++index < arrLength) {
    const arrValue = array[index];
    const othValue = other[index];
    if (seen) {
      if (
        !arraySome(other, (othValue2: SafeAny, othIndex: number) => {
          if ((!seen.has(othIndex) && arrValue === othValue2) || equalFunc(arrValue, othValue2, seen, stack)) {
            seen.add(othIndex);
            return true;
          }
        })
      ) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, seen, stack))) {
      result = false;
      break;
    }
  }
  stack.delete(array);
  stack.delete(other);
  return result;
}

function arraySome(array: SafeAny, predicate: SafeAny) {
  let index = -1;
  const length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/** 处理对象 */
function equalObject(
  object: SafeAny,
  other: SafeAny,
  equalFunc: (value: SafeAny, other: SafeAny, seen?: WeakSet<SafeAny>, stack?: WeakMap<SafeAny, SafeAny>) => boolean,
  seen?: WeakSet<SafeAny>,
  stack?: WeakMap<SafeAny, SafeAny>
) {
  const objProps = getObjectKeys(object);
  const othProps = getObjectKeys(other);
  const objLength = objProps.length;
  const othLength = othProps.length;
  // 如果对象keys不相等 直接返回false
  if (objLength !== othLength) {
    return false;
  }
  // 先保证keys都一样
  let index = objLength;
  while (index--) {
    const key = objProps[index];
    if (!(key in other)) {
      return false;
    }
  }

  // 假设循环值相等
  const stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked === other;
  }
  // 递归地比较对象(容易受到调用堆栈限制的影响)
  stack.set(object, other);
  stack.set(other, object);
  let result = true;
  let skipCtor = false;
  while (++index < othLength) {
    const key = objProps[index];
    const objValue = object[key];
    const othValue = other[key];
    // 递归地比较对象(容易受到调用堆栈限制的影响)
    if (!(objValue === othValue || equalFunc(objValue, othValue, seen, stack))) {
      result = false;
      break;
    }
    // 自己重写的constructor，我们需要跳过
    skipCtor = key === 'constructor';
  }

  // 处理 constructor
  if (result && !skipCtor) {
    const objCtor = object.constructor;
    const othCtor = other.constructor;
    // 具有不同构造函数的非“对象”对象实例不相等。
    if (
      objCtor !== othCtor &&
      'constructor' in object &&
      'constructor' in other &&
      !(typeof objCtor === 'function' && objCtor instanceof objCtor && typeof othCtor === 'function' && othCtor instanceof othCtor)
    ) {
      result = false;
    }
  }
  stack.delete(object);
  stack.delete(other);
  return result;
}

/** 处理其他对象 */
function equalTag(
  object: SafeAny,
  other: SafeAny,
  tag: string,
  equalFunc: (value: SafeAny, other: SafeAny, seen?: WeakSet<SafeAny>, stack?: WeakMap<SafeAny, SafeAny>) => boolean,
  seen?: WeakSet<SafeAny>,
  stack?: WeakMap<SafeAny, SafeAny>
) {
  switch (tag) {
    case boolTag:
    case dateTag:
    case numberTag:
      // 将布尔值强制为“1”或“0”，并将日期强制为毫秒。无效日期被强制到“NaN”。
      object = +object;
      other = +other;
      return object === other || (object !== object && other !== other);
    case stringTag:
    case regexpTag:
      // 将正则表达式强制到字符串，并将字符串、原语和对象同等对待。
      // See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // tslint:disable-next-line: triple-equals
      return object == other + '';
    case errorTag:
      // Error的name和message一样，我们就认为是同一个Error对象
      return object.name === other.name && object.message === other.message;
    case mapTag:
    case setTag:
      // 如果 size 不相等 直接返回
      if (object.size !== other.size) {
        return false;
      }
      const convert = tag === mapTag ? mapToArray : setToArray;
      // 假设循环值相等
      const stackedSet = stack.get(object);
      if (stackedSet) {
        return stackedSet === other;
      }
      // 递归地比较对象(容易受到调用堆栈限制的影响)
      stack.set(object, other);
      const result = equalArray(convert(object), convert(other), equalFunc, seen || new Set(), stack);
      stack.delete(object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) === symbolValueOf.call(other);
      }
  }
  return false;
}

function mapToArray(map: SafeAny) {
  let index = -1;
  const result = Array(map.size);
  map.forEach(function (value: SafeAny, key: SafeAny) {
    result[++index] = [key, value];
  });
  return result;
}

function setToArray(set: SafeAny) {
  let index = -1;
  const result = Array(set.size);
  set.forEach(function (value: SafeAny) {
    result[++index] = value;
  });
  return result;
}

const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

const nativeGetSymbols = Object.getOwnPropertySymbols;

/** 获取自身keys和symbols Object.keys无法获取symbols */
function getObjectKeys(object: any): (string | symbol)[] {
  const keys = Object.keys(object);
  const symbols = !nativeGetSymbols ? [] : Object.getOwnPropertySymbols(object).filter(symbol => propertyIsEnumerable.call(object, symbol));
  return [...keys, ...symbols];
}
