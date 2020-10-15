import { isArray, isFunction, isMap, isPrototype, isSet, typeOf } from '@ngx-simple/core/typeof';
import { SafeAny } from '@ngx-simple/core/types';

const objectTag = '[object Object]';
const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const mapTag = '[object Map]';
const numberTag = '[object Number]';
const regexpTag = '[object RegExp]';
const setTag = '[object Set]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const hasOwnProperty = Object.prototype.hasOwnProperty;

/** 只拷贝预设类型 Error WeakMap Function ArrayTypes 不处理 */
const cloneableTags = {};
cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[
  regexpTag
] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = true;

function forEach<T>(target: T[], callback: (value: T, key: number) => void): void {
  let index = -1;
  const length = target.length;
  while (++index < length) {
    callback(target[index], index);
  }
}

const symbolProto = Symbol ? Symbol.prototype : undefined;
const symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

function cloneSymbol(symbol: SafeAny): symbol {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/** 用于从强制字符串值匹配' RegExp '标志。 */
const reFlags = /\w*$/;

function cloneRegExp(regexp: SafeAny): RegExp {
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

export function initCloneObject(object: SafeAny) {
  return isFunction(object.constructor) && !isPrototype(object) ? Object.create(Object.getPrototypeOf(object)) : {};
}

export function copyArray(source: SafeAny) {
  let index = -1;
  const length = source.length;

  const array = new Array(length);
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

function initCloneArray(array: SafeAny) {
  const length = array.length,
    result = new array.constructor(length);

  if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

function initCloneByTag(target: SafeAny, tag: string) {
  const Ctor = target.constructor;
  switch (tag) {
    case boolTag:
    case dateTag:
      return new Ctor(+target);
    case stringTag:
    case numberTag:
      return new Ctor(target);
    case mapTag:
    case setTag:
      return new Ctor();
    case regexpTag:
      return cloneRegExp(target);
    case symbolTag:
      return cloneSymbol(target);
    default:
      break;
  }
}

function assignValue(object: SafeAny, key: string, value: SafeAny) {
  const objValue = object[key];
  if (
    !(hasOwnProperty.call(object, key) && (objValue === value || (objValue !== objValue && value !== value))) ||
    (value === undefined && !(key in object))
  ) {
    object[key] = value;
  }
}

/**
 * 深度克隆
 * @param target 克隆目标
 * @param cache 缓存(解决循环依赖问题)
 * @returns 返回克隆的目标值
 */
export function clone<T>(target: T, cache?: WeakMap<object, T>): T {
  // primitive value(包含null、undefined)和 function 直接返回
  if (typeof target !== 'object' || target == null) {
    return target;
  }
  // 深度克隆
  return cloneDeep(target, cache) as T;
}

function cloneDeep(target: SafeAny, stack?: WeakMap<object, SafeAny>) {
  const isArr = isArray(target);
  let result: SafeAny;
  // 先处理数组
  if (isArr) {
    result = initCloneArray(target);
  } else {
    const tag = typeOf(target);
    if (tag === objectTag) {
      result = initCloneObject(target);
    } else {
      // 不是预设类型不处理直接返回
      if (!cloneableTags[tag]) {
        return target;
      }
      result = initCloneByTag(target, tag);
    }
  }

  // 检查循环引用并返回其对应的克隆。
  // tslint:disable-next-line: no-unused-expression
  stack || (stack = new WeakMap());

  const stacked = stack.get(target);
  if (stacked) {
    return stacked;
  }
  stack.set(target, result);

  if (isSet(target)) {
    target.forEach(subValue => {
      result.add(clone(subValue, stack));
    });
  } else if (isMap(target)) {
    target.forEach((subValue, key) => {
      result.set(key, clone(subValue, stack));
    });
  }

  const props = isArr ? undefined : Object.keys(target);

  forEach(props || target, (value: SafeAny, key: SafeAny) => {
    if (props) {
      key = value;
      value = target[key];
    }
    // 递归填充克隆(易受调用堆栈限制的影响)
    assignValue(result, key, clone(value, stack));
  });

  return result;
}
