import { args, falsely, slice, symbol } from '@ngx-simple/core/testing';
import { isBoolean } from './boolean';

describe('isBoolean', function () {
  it('should return `true` for booleans', function () {
    expect(isBoolean(true)).toBeTruthy();
    expect(isBoolean(false)).toBeTruthy();
    expect(isBoolean(Object(true))).toBeTruthy();
    expect(isBoolean(Object(false))).toBeTruthy();
  });

  it('should return `false` for non-booleans', function () {
    const expected = falsely.map(value => value === false);

    const actual = falsely.map(isBoolean);

    expect(actual).toStrictEqual(expected);

    expect(isBoolean(args)).toBeFalsy();
    expect(isBoolean([1, 2, 3])).toBeFalsy();
    expect(isBoolean(new Date())).toBeFalsy();
    expect(isBoolean(new Error())).toBeFalsy();
    expect(isBoolean(slice)).toBeFalsy();
    expect(isBoolean({ a: 1 })).toBeFalsy();
    expect(isBoolean(1)).toBeFalsy();
    expect(isBoolean(/x/)).toBeFalsy();
    expect(isBoolean('a')).toBeFalsy();
    expect(isBoolean(symbol)).toBeFalsy();
  });
});
