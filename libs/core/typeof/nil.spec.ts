import { args, falsely, slice, symbol } from '@ngx-simple/core/testing';
import { isNil, isNull, isUndefined } from './nil';

describe('isNil', function () {
  it('should return `true` for nullish values', function () {
    expect(isNil(null)).toBeTruthy();
    expect(isNil(void 0)).toBeTruthy();
    expect(isNil(undefined)).toBeTruthy();
  });

  it('should return `false` for non-nullish values', function () {
    const expected = falsely.map(value => value == null);

    const actual = falsely.map(isNil);

    expect(actual).toStrictEqual(expected);

    expect(isNil(args)).toBeFalsy();
    expect(isNil([1, 2, 3])).toBeFalsy();
    expect(isNil(true)).toBeFalsy();
    expect(isNil(new Date())).toBeFalsy();
    expect(isNil(new Error())).toBeFalsy();
    expect(isNil(slice)).toBeFalsy();
    expect(isNil({ a: 1 })).toBeFalsy();
    expect(isNil(1)).toBeFalsy();
    expect(isNil(/x/)).toBeFalsy();
    expect(isNil('a')).toBeFalsy();
    expect(isNil(symbol)).toBeFalsy();
  });
});

describe('isNull', function () {
  it('should return `true` for `null` values', function () {
    expect(isNull(null)).toBeTruthy();
  });

  it('should return `false` for non `null` values', function () {
    const expected = falsely.map(value => value === null);

    const actual = falsely.map(isNull);

    expect(actual).toStrictEqual(expected);

    expect(isNull(args)).toBeFalsy();
    expect(isNull([1, 2, 3])).toBeFalsy();
    expect(isNull(true)).toBeFalsy();
    expect(isNull(new Date())).toBeFalsy();
    expect(isNull(new Error())).toBeFalsy();
    expect(isNull(slice)).toBeFalsy();
    expect(isNull({ a: 1 })).toBeFalsy();
    expect(isNull(1)).toBeFalsy();
    expect(isNull(/x/)).toBeFalsy();
    expect(isNull('a')).toBeFalsy();
    expect(isNull(symbol)).toBeFalsy();
  });
});

describe('isUndefined', function () {
  it('should return `true` for `undefined` values', function () {
    expect(isUndefined(void 0)).toBeTruthy();
    expect(isUndefined(undefined)).toBeTruthy();
  });

  it('should return `false` for non `undefined` values', function () {
    const expected = falsely.map(value => value === undefined);

    const actual = falsely.map(isUndefined);

    expect(actual).toStrictEqual(expected);

    expect(isUndefined(args)).toBeFalsy();
    expect(isUndefined([1, 2, 3])).toBeFalsy();
    expect(isUndefined(true)).toBeFalsy();
    expect(isUndefined(new Date())).toBeFalsy();
    expect(isUndefined(new Error())).toBeFalsy();
    expect(isUndefined(slice)).toBeFalsy();
    expect(isUndefined({ a: 1 })).toBeFalsy();
    expect(isUndefined(1)).toBeFalsy();
    expect(isUndefined(/x/)).toBeFalsy();
    expect(isUndefined('a')).toBeFalsy();
    expect(isUndefined(symbol)).toBeFalsy();
  });
});
