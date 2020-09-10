import {
  args,
  body,
  CustomError,
  document,
  errors,
  falsely,
  objectProto,
  slice,
  stubFalse,
  stubTrue,
  symbol
} from '@ngx-simple/core/testing';
import { isDate, isError, isMap, isObject, isObjectLike, isPlainObject, isRegExp, isSet, isWeakMap, isWeakSet } from './object';

describe('isPlainObject', function () {
  const element = document && document.createElement('div');

  it('should detect plain objects', function () {
    function Foo(a: number) {
      this.a = a || 1;
    }

    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject({ a: 1 })).toBeTruthy();
    expect(isPlainObject({ constructor: Foo })).toBeTruthy();
    expect(isPlainObject([1, 2, 3])).toBeFalsy();
    expect(isPlainObject(new Foo(1))).toBeFalsy();
  });

  it('should return `true` for objects with a `[[Prototype]]` of `null`', function () {
    const object = Object.create(null);
    expect(isPlainObject(object)).toBeTruthy();

    object.constructor = objectProto.constructor;
    expect(isPlainObject(object)).toBeTruthy();
  });

  it('should return `true` for objects with a `valueOf` property', function () {
    expect(isPlainObject({ valueOf: 0 })).toBeTruthy();
  });

  it('should return `true` for objects with a writable `Symbol.toStringTag` property', function () {
    if (Symbol && Symbol.toStringTag) {
      const object = {};
      // object[Symbol.toStringTag] = 'X';

      expect(isPlainObject(object)).toBeTruthy();
    }
  });

  it('should return `false` for objects with a custom `[[Prototype]]`', function () {
    const object = Object.create({ a: 1 });
    expect(isPlainObject(object)).toBeFalsy();
  });

  it('should return `false` for DOM elements', function () {
    if (element) {
      expect(isPlainObject(element)).toBeFalsy();
    }
  });

  it('should return `false` for non-Object objects', function () {
    expect(isPlainObject(arguments)).toBeFalsy();
    expect(isPlainObject(Error)).toBeFalsy();
    expect(isPlainObject(Math)).toBeFalsy();
  });

  it('should return `false` for non-objects', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isPlainObject);

    expect(actual).toStrictEqual(expected);

    expect(isPlainObject(true)).toBeFalsy();
    expect(isPlainObject('a')).toBeFalsy();
    expect(isPlainObject(symbol)).toBeFalsy();
  });

  it('should return `false` for objects with a read-only `Symbol.toStringTag` property', function () {
    if (Symbol && Symbol.toStringTag) {
      const object = {};
      Object.defineProperty(object, Symbol.toStringTag, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: 'X'
      });

      expect(isPlainObject(object)).toBeFalsy();
    }
  });

  it('should not mutate `value`', function () {
    if (Symbol && Symbol.toStringTag) {
      const proto = {};
      proto[Symbol.toStringTag] = undefined;
      const object = Object.create(proto);

      expect(isPlainObject(object)).toBeFalsy();
      expect(object.hasOwnProperty(Symbol.toStringTag)).toBeFalsy();
    }
  });
});

describe('isObjectLike', function () {
  it('should return `true` for objects', function () {
    expect(isObjectLike(args)).toBeTruthy();
    expect(isObjectLike([1, 2, 3])).toBeTruthy();
    expect(isObjectLike(Object(false))).toBeTruthy();
    expect(isObjectLike(new Date())).toBeTruthy();
    expect(isObjectLike(new Error())).toBeTruthy();
    expect(isObjectLike({ a: 1 })).toBeTruthy();
    expect(isObjectLike(Object(0))).toBeTruthy();
    expect(isObjectLike(/x/)).toBeTruthy();
    expect(isObjectLike(Object('a'))).toBeTruthy();
  });

  it('should return `false` for non-objects', function () {
    const values = falsely.concat(true, slice, 1, 'a', symbol),
      expected = values.map(stubFalse);

    const actual = values.map(isObjectLike);

    expect(actual).toStrictEqual(expected);
  });
});

describe('isObject', function () {
  it('should return `true` for objects', function () {
    expect(isObject(args)).toBeTruthy();
    expect(isObject([1, 2, 3])).toBeTruthy();
    expect(isObject(Object(false))).toBeTruthy();
    expect(isObject(new Date())).toBeTruthy();
    expect(isObject(new Error())).toBeTruthy();
    expect(isObject(slice)).toBeTruthy();
    expect(isObject({ a: 1 })).toBeTruthy();
    expect(isObject(Object(0))).toBeTruthy();
    expect(isObject(/x/)).toBeTruthy();
    expect(isObject(Object('a'))).toBeTruthy();

    if (document) {
      expect(isObject(body)).toBeTruthy();
    }
    if (Symbol) {
      expect(isObject(Object(symbol))).toBeTruthy();
    }
  });

  it('should return `false` for non-objects', function () {
    const values = falsely.concat(true, 1, 'a', symbol),
      expected = values.map(stubFalse);

    const actual = values.map(isObject);

    expect(actual).toStrictEqual(expected);
  });
});

describe('isMap', function () {
  it('should return `true` for maps', function () {
    expect(isMap(new Map())).toBeTruthy();
  });

  it('should return `false` for non-maps', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isMap);

    expect(actual).toStrictEqual(expected);

    expect(isMap(args)).toBeFalsy();
    expect(isMap([1, 2, 3])).toBeFalsy();
    expect(isMap(true)).toBeFalsy();
    expect(isMap(new Date())).toBeFalsy();
    expect(isMap(new Error())).toBeFalsy();
    expect(isMap(slice)).toBeFalsy();
    expect(isMap({ a: 1 })).toBeFalsy();
    expect(isMap(1)).toBeFalsy();
    expect(isMap(/x/)).toBeFalsy();
    expect(isMap('a')).toBeFalsy();
    expect(isMap(symbol)).toBeFalsy();
    expect(isMap(new WeakMap())).toBeFalsy();
  });

  it('should work for objects with a non-function `constructor` (test in IE 11)', function () {
    const values = [false, true],
      expected = values.map(stubFalse);

    const actual = values.map(value => isMap({ constructor: value }));

    expect(actual).toStrictEqual(expected);
  });
});

describe('isSet', function () {
  it('should return `true` for sets', function () {
    expect(isSet(new Set())).toBeTruthy();
  });

  it('should return `false` for non-sets', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isSet);

    expect(actual).toStrictEqual(expected);

    expect(isSet(args)).toBeFalsy();
    expect(isSet([1, 2, 3])).toBeFalsy();
    expect(isSet(true)).toBeFalsy();
    expect(isSet(new Date())).toBeFalsy();
    expect(isSet(new Error())).toBeFalsy();
    expect(isSet(slice)).toBeFalsy();
    expect(isSet({ a: 1 })).toBeFalsy();
    expect(isSet(1)).toBeFalsy();
    expect(isSet(/x/)).toBeFalsy();
    expect(isSet('a')).toBeFalsy();
    expect(isSet(symbol)).toBeFalsy();
    expect(isSet(new WeakSet())).toBeFalsy();
  });

  it('should work for objects with a non-function `constructor` (test in IE 11)', function () {
    const values = [false, true],
      expected = values.map(stubFalse);

    const actual = values.map(value => isSet({ constructor: value }));

    expect(actual).toStrictEqual(expected);
  });
});

describe('isWeakMap', function () {
  it('should return `true` for weak maps', function () {
    expect(isWeakMap(new WeakMap())).toBeTruthy();
  });

  it('should return `false` for non weak maps', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isWeakMap);

    expect(actual).toStrictEqual(expected);

    expect(isWeakMap(args)).toBeFalsy();
    expect(isWeakMap([1, 2, 3])).toBeFalsy();
    expect(isWeakMap(true)).toBeFalsy();
    expect(isWeakMap(new Date())).toBeFalsy();
    expect(isWeakMap(new Error())).toBeFalsy();
    expect(isWeakMap(slice)).toBeFalsy();
    expect(isWeakMap({ a: 1 })).toBeFalsy();
    expect(isWeakMap(new Map())).toBeFalsy();
    expect(isWeakMap(1)).toBeFalsy();
    expect(isWeakMap(/x/)).toBeFalsy();
    expect(isWeakMap('a')).toBeFalsy();
    expect(isWeakMap(symbol)).toBeFalsy();
  });

  it('should work for objects with a non-function `constructor` (test in IE 11)', function () {
    const values = [false, true],
      expected = values.map(stubFalse);

    const actual = values.map(value => isWeakMap({ constructor: value }));

    expect(actual).toStrictEqual(expected);
  });
});

describe('isWeakSet', function () {
  it('should return `true` for weak sets', function () {
    expect(isWeakSet(new WeakSet())).toBeTruthy();
  });

  it('should return `false` for non weak sets', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isWeakSet);

    expect(actual).toStrictEqual(expected);

    expect(isWeakSet(args)).toBeFalsy();
    expect(isWeakSet([1, 2, 3])).toBeFalsy();
    expect(isWeakSet(true)).toBeFalsy();
    expect(isWeakSet(new Date())).toBeFalsy();
    expect(isWeakSet(new Error())).toBeFalsy();
    expect(isWeakSet(slice)).toBeFalsy();
    expect(isWeakSet({ a: 1 })).toBeFalsy();
    expect(isWeakSet(1)).toBeFalsy();
    expect(isWeakSet(/x/)).toBeFalsy();
    expect(isWeakSet('a')).toBeFalsy();
    expect(isWeakSet(new Set())).toBeFalsy();
    expect(isWeakSet(symbol)).toBeFalsy();
  });
});

describe('isRegExp', function () {
  it('should return `true` for regexes', function () {
    expect(isRegExp(/x/)).toBeTruthy();
    expect(isRegExp(RegExp('x'))).toBeTruthy();
  });

  it('should return `false` for non-regexes', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isRegExp);

    expect(actual).toStrictEqual(expected);

    expect(isRegExp(args)).toBeFalsy();
    expect(isRegExp([1, 2, 3])).toBeFalsy();
    expect(isRegExp(true)).toBeFalsy();
    expect(isRegExp(new Date())).toBeFalsy();
    expect(isRegExp(new Error())).toBeFalsy();
    expect(isRegExp(slice)).toBeFalsy();
    expect(isRegExp({ a: 1 })).toBeFalsy();
    expect(isRegExp(1)).toBeFalsy();
    expect(isRegExp('a')).toBeFalsy();
    expect(isRegExp(symbol)).toBeFalsy();
  });
});

describe('isError', function () {
  it('should return `true` for error objects', function () {
    const expected = errors.map(stubTrue);

    const actual = errors.map(isError);

    expect(actual).toStrictEqual(expected);
  });

  it('letuld return `true` for subclassed values', function () {
    expect(isError(new CustomError('x'))).toBeTruthy();
  });

  it('should return `false` for non error objects', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isError);

    expect(actual).toStrictEqual(expected);

    expect(isError(args)).toBeFalsy();
    expect(isError([1, 2, 3])).toBeFalsy();
    expect(isError(true)).toBeFalsy();
    expect(isError(new Date())).toBeFalsy();
    expect(isError(slice)).toBeFalsy();
    expect(isError({ a: 1 })).toBeFalsy();
    expect(isError(1)).toBeFalsy();
    expect(isError(/x/)).toBeFalsy();
    expect(isError('a')).toBeFalsy();
    expect(isError(symbol)).toBeFalsy();
  });

  it('should return `false` for plain objects', function () {
    expect(isError({ name: 'Error', message: '' })).toBeFalsy();
  });
});

describe('isDate', function () {
  it('should return `true` for dates', function () {
    expect(isDate(new Date())).toBeTruthy();
  });

  it('should return `false` for non-dates', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isDate);

    expect(actual).toStrictEqual(expected);

    expect(isDate(args)).toBeFalsy();
    expect(isDate([1, 2, 3])).toBeFalsy();
    expect(isDate(true)).toBeFalsy();
    expect(isDate(new Error())).toBeFalsy();
    expect(isDate(slice)).toBeFalsy();
    expect(isDate({ a: 1 })).toBeFalsy();
    expect(isDate(1)).toBeFalsy();
    expect(isDate(/x/)).toBeFalsy();
    expect(isDate('a')).toBeFalsy();
    expect(isDate(symbol)).toBeFalsy();
  });
});
