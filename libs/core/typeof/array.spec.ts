import { args, asyncFunc, falsely, genFunc, slice, stubFalse, stubTrue, symbol } from '@ngx-simple/core/testing';
import { isArray, isArrayLike, isLength, MAX_SAFE_INTEGER } from './array';

describe('isArray', function () {
  it('should return `true` for arrays', function () {
    expect(isArray([1, 2, 3])).toBeTruthy();
  });

  it('should return `false` for non-arrays', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isArray);

    expect(actual).toStrictEqual(expected);

    expect(isArray(args)).toBeFalsy();
    expect(isArray(true)).toBeFalsy();
    expect(isArray(new Date())).toBeFalsy();
    expect(isArray(new Error())).toBeFalsy();
    expect(isArray(slice)).toBeFalsy();
    expect(isArray({ '0': 1, length: 1 })).toBeFalsy();
    expect(isArray(1)).toBeFalsy();
    expect(isArray(/x/)).toBeFalsy();
    expect(isArray('a')).toBeFalsy();
    expect(isArray(symbol)).toBeFalsy();
  });
});

describe('isLength', function () {
  it('should return `true` for lengths', function () {
    const values = [0, 3, MAX_SAFE_INTEGER],
      expected = values.map(stubTrue),
      actual = values.map(isLength);

    expect(actual).toStrictEqual(expected);
  });

  it('should return `false` for non-lengths', function () {
    const values = [-1, '1', 1.1, MAX_SAFE_INTEGER + 1],
      expected = values.map(stubFalse),
      actual = values.map(isLength);

    expect(actual).toStrictEqual(expected);
  });
});

describe('isArrayLike', function () {
  it('should return `true` for array-like values', function () {
    const values = [args, [1, 2, 3], { '0': 'a', length: 1 }, 'a'],
      expected = values.map(stubTrue),
      actual = values.map(isArrayLike);

    expect(actual).toStrictEqual(expected);
  });

  it('should return `false` for non-arrays', function () {
    const expected = falsely.map(value => value === '');

    const actual = falsely.map(isArrayLike);

    expect(actual).toStrictEqual(expected);

    expect(isArrayLike(true)).toBeFalsy();
    expect(isArrayLike(new Date())).toBeFalsy();
    expect(isArrayLike(new Error())).toBeFalsy();
    expect(isArrayLike(asyncFunc)).toBeFalsy();
    expect(isArrayLike(genFunc)).toBeFalsy();
    expect(isArrayLike(slice)).toBeFalsy();
    expect(isArrayLike({ a: 1 })).toBeFalsy();
    expect(isArrayLike(1)).toBeFalsy();
    expect(isArrayLike(/x/)).toBeFalsy();
    expect(isArrayLike(symbol)).toBeFalsy();
  });
});
