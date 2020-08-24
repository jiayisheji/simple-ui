import { args, falsely, slice, symbol } from '@ngx-simple/simple-ui/testing';
import { isString } from './string';

describe('isString', function () {
  it('should return `true` for strings', function () {
    expect(isString('a')).toBeTruthy();
    expect(isString(Object('a'))).toBeTruthy();
  });

  it('should return `false` for non-strings', function () {
    const expected = falsely.map(value => value === '');
    const actual = falsely.map(isString);

    expect(actual).toStrictEqual(expected);

    expect(isString(args)).toBeFalsy();
    expect(isString([1, 2, 3])).toBeFalsy();
    expect(isString(true)).toBeFalsy();
    expect(isString(new Date())).toBeFalsy();
    expect(isString(new Error())).toBeFalsy();
    expect(isString(slice)).toBeFalsy();
    expect(isString({ '0': 1, length: 1 })).toBeFalsy();
    expect(isString(1)).toBeFalsy();
    expect(isString(/x/)).toBeFalsy();
    expect(isString(symbol)).toBeFalsy();
  });
});
