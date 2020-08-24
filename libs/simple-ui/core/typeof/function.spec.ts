import {
  args,
  arrayViews,
  asyncFunc,
  falsely,
  funcTag,
  genFunc,
  objToString,
  root,
  slice,
  stubFalse,
  symbol
} from '@ngx-simple/simple-ui/testing';
import { isFunction } from './function';

describe('isFunction', function () {
  it('should return `true` for functions', function () {
    expect(isFunction(slice)).toBeTruthy();
  });

  it('should return `true` for async functions', function () {
    expect(isFunction(asyncFunc)).toBe(typeof asyncFunc === 'function');
  });

  it('should return `true` for generator functions', function () {
    expect(isFunction(genFunc)).toBe(typeof genFunc === 'function');
  });

  it('should return `true` for the `Proxy` constructor', function () {
    if (Proxy) {
      expect(isFunction(Proxy)).toBeTruthy();
    }
  });

  it('should return `true` for array view constructors', function () {
    const expected = arrayViews.map(type => objToString.call(root[type]) === funcTag);
    const actual = arrayViews.map(type => isFunction(root[type]));

    expect(actual).toStrictEqual(expected);
  });

  it('should return `false` for non-functions', function () {
    const expected = falsely.map(stubFalse);

    const actual = falsely.map(isFunction);

    expect(actual).toStrictEqual(expected);

    expect(isFunction(args)).toBeFalsy();
    expect(isFunction([1, 2, 3])).toBeFalsy();
    expect(isFunction(true)).toBeFalsy();
    expect(isFunction(new Date())).toBeFalsy();
    expect(isFunction(new Error())).toBeFalsy();
    expect(isFunction({ a: 1 })).toBeFalsy();
    expect(isFunction(1)).toBeFalsy();
    expect(isFunction(/x/)).toBeFalsy();
    expect(isFunction('a')).toBeFalsy();
    expect(isFunction(symbol)).toBeFalsy();

    if (document) {
      expect(isFunction(document.getElementsByTagName('body'))).toBeFalsy();
    }
  });
});
