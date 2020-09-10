import { stubString, symbol } from '@ngx-simple/core/testing';
import { toString } from './string';

describe('toString', function () {
  it('should treat nullish values as empty strings', function () {
    const values = [, null, undefined],
      expected = values.map(stubString);
    const actual = values.map(toString);

    expect(actual).toStrictEqual(expected);
  });

  it('should preserve the sign of `0`', function () {
    const values = [-0, Object(-0), 0, Object(0)],
      expected = ['-0', '-0', '0', '0'],
      actual = values.map(toString);

    expect(actual).toStrictEqual(expected);
  });

  it('should preserve the sign of `0` in an array', function () {
    const values = [-0, Object(-0), 0, Object(0)];
    expect(toString(values)).toBe('-0,-0,0,0');
  });

  it('should handle string', function () {
    expect(toString('string')).toBe('string');
  });

  it('should handle symbols', function () {
    expect(toString(symbol)).toBe('Symbol(a)');
  });

  it('should handle an array of symbols', function () {
    expect(toString([symbol])).toBe('Symbol(a)');
  });
});
