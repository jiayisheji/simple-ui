export const root = (typeof global === 'object' && global) || this;

export const arrayProto = Array.prototype;
export const funcProto = Function.prototype;
export const objectProto = Object.prototype;
export const numberProto = Number.prototype;
export const stringProto = String.prototype;

export const argsTag = '[object Arguments]';
export const arrayTag = '[object Array]';
export const asyncTag = '[object AsyncFunction]';
export const boolTag = '[object Boolean]';
export const dateTag = '[object Date]';
export const domExcTag = '[object DOMException]';
export const errorTag = '[object Error]';
export const funcTag = '[object Function]';
export const genTag = '[object GeneratorFunction]';
export const mapTag = '[object Map]';
export const numberTag = '[object Number]';
export const nullTag = '[object Null]';
export const objectTag = '[object Object]';
export const promiseTag = '[object Promise]';
export const proxyTag = '[object Proxy]';
export const regexpTag = '[object RegExp]';
export const setTag = '[object Set]';
export const stringTag = '[object String]';
export const symbolTag = '[object Symbol]';
export const undefinedTag = '[object Undefined]';
export const weakMapTag = '[object WeakMap]';
export const weakSetTag = '[object WeakSet]';

export const document = root === window ? root.document : undefined;
export const body = document ? document.body : undefined;
/** 提供返回false函数 */
export const stubFalse = () => false;
/** 提供返回true函数 */
export const stubTrue = () => true;

export const stubArray = () => [];
export const stubObject = () => {};
export const stubString = () => '';

/** 提供空函数 */
export const noop = function () {};
export const slice = arrayProto.slice;
export const objToString = objectProto.toString;
/** 提供错误对象 */
export const errors = [
  new Error(),
  new EvalError(),
  new RangeError(),
  new ReferenceError(),
  new SyntaxError(),
  new TypeError(),
  new URIError()
];
/** 提供原始值 */
export const primitives = [null, undefined, false, true, 1, NaN, 'a'];
/** 提供假值 */
export const falsely: any[] = [, null, undefined, false, 0, NaN, ''];
/** 提供arguments对象 */
export const args = function () {
  return arguments;
}.call(null, 1, 2, 3);
/** 提供AsyncFunction */
export const asyncFunc = Function('return async () => {}');
/** 提供GeneratorFunction */
export const genFunc = Function('return function*(){}');
/** 提供Symbol */
export const symbol = Symbol ? Symbol('a') : undefined;

/** 用作各种数字常量的引用 */
export const MAX_SAFE_INTEGER = 9007199254740991;
export const MAX_INTEGER = 1.7976931348623157e308;

/** 用作数组的最大长度和索引的引用 */
export const MAX_ARRAY_LENGTH = 4294967295;
export const MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/**
 * 创建自定义错误对象
 */
export class CustomError {
  name: string = 'CustomError';
  constructor(public message: string | Error) {}
}

/** 用于检查方法是否支持类型数组 */
export const typedArrays = [
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array'
];

/** 用于检查方法是否支持数组视图 */
export const arrayViews = typedArrays.concat('DataView');
