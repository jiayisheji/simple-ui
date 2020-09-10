import { args, falsely, MAX_INTEGER, slice, stubFalse, stubTrue, symbol } from '@ngx-simple/core/testing';
import { isInteger, isNumber } from './number';

describe('isNumber', function () {
  it('should return `true` for numbers', function () {
    expect(isNumber(0)).toBeTruthy();
    expect(isNumber(Object(0))).toBeTruthy();
  });

  it('should return `false` for non-numbers or NaN', function () {
    const expected = falsely.map(value => typeof value === 'number' && value === value);

    const actual = falsely.map(isNumber);

    expect(actual).toStrictEqual(expected);

    expect(isNumber(NaN)).toBeFalsy();
    expect(isNumber(args)).toBeFalsy();
    expect(isNumber([1, 2, 3])).toBeFalsy();
    expect(isNumber(true)).toBeFalsy();
    expect(isNumber(new Date())).toBeFalsy();
    expect(isNumber(new Error())).toBeFalsy();
    expect(isNumber(slice)).toBeFalsy();
    expect(isNumber({ a: 1 })).toBeFalsy();
    expect(isNumber(/x/)).toBeFalsy();
    expect(isNumber('a')).toBeFalsy();
    expect(isNumber(symbol)).toBeFalsy();
  });
});

describe('isInteger', function () {
  it('should return `true` for integer values', function () {
    const values = [-1, 0, 1],
      expected = values.map(stubTrue);

    const actual = values.map(isInteger);

    expect(actual).toStrictEqual(expected);

    expect(isInteger(MAX_INTEGER));
  });

  it('should return `false` for non-integer number values', function () {
    const values = [NaN, Infinity, -Infinity, Object(1), 3.14],
      expected = values.map(stubFalse);

    const actual = values.map(isInteger);

    expect(actual).toStrictEqual(expected);
  });

  it('should return `false` for non-numeric values', function () {
    const expected = falsely.map(value => value === 0);

    const actual = falsely.map(isInteger);

    expect(actual).toStrictEqual(expected);

    expect(isInteger(args)).toBeFalsy();
    expect(isInteger([1, 2, 3])).toBeFalsy();
    expect(isInteger(true)).toBeFalsy();
    expect(isInteger(new Date())).toBeFalsy();
    expect(isInteger(new Error())).toBeFalsy();
    expect(isInteger({ a: 1 })).toBeFalsy();
    expect(isInteger(/x/)).toBeFalsy();
    expect(isInteger('a')).toBeFalsy();
    expect(isInteger(symbol)).toBeFalsy();
  });
});
