import { MAX_SAFE_INTEGER } from '../typeof';
import { isEmpty } from './empty';

describe('isEmpty', () => {
  it('should return `true` for empty values', () => {
    expect(isEmpty(0)).toBeTruthy();
    expect(isEmpty(1)).toBeTruthy();
    expect(isEmpty(true)).toBeTruthy();
    expect(isEmpty('')).toBeTruthy();
    expect(isEmpty([])).toBeTruthy();
    expect(isEmpty({})).toBeTruthy();
    expect(isEmpty(new Map())).toBeTruthy();
    expect(isEmpty(new Set())).toBeTruthy();
    expect(isEmpty(new Object())).toBeTruthy();
    expect(isEmpty(void 0)).toBeTruthy();
    expect(isEmpty(Symbol())).toBeTruthy();
    expect(isEmpty(/x/)).toBeTruthy();
    expect(isEmpty(NaN)).toBeTruthy();
    expect(isEmpty(Array.prototype.slice)).toBeTruthy();
  });

  it('should return `false` for non-empty values', () => {
    expect(isEmpty([0])).toBeFalsy();
    expect(isEmpty({ a: 0 })).toBeFalsy();
    expect(isEmpty('a')).toBeFalsy();
  });

  it('should work with an object that has a `length` property', () => {
    expect(isEmpty({ length: 0 })).toBeFalsy();
  });

  it('should work with `arguments` objects', function () {
    expect(isEmpty(arguments)).toBeTruthy();

    function args() {
      expect(isEmpty(arguments)).toBeFalsy();
    }
    args.call(null, 1, 2, 3);
  });

  it('should work with prototype objects', () => {
    function Foo() {}
    Foo.prototype = { constructor: Foo };

    expect(isEmpty(Foo.prototype)).toBeTruthy();

    Foo.prototype.a = 1;

    expect(isEmpty(Foo.prototype)).toBeFalsy();
  });

  it('should work with maps', () => {
    if (Map) {
      const map = new Map();
      expect(isEmpty(map)).toBeTruthy();
      map.set('a', 1);
      expect(isEmpty(map)).toBeFalsy();
      map.clear();
    }
  });

  it('should work with sets', () => {
    if (Set) {
      const set = new Set();
      expect(isEmpty(set)).toBeTruthy();
      set.add(1);
      expect(isEmpty(set)).toBeFalsy();
      set.clear();
    }
  });

  it('should not treat objects with negative lengths as array-like', () => {
    function Foo() {}
    Foo.prototype.length = -1;
    expect(isEmpty(new Foo())).toBeTruthy();
  });

  it('should not treat objects with lengths larger than `MAX_SAFE_INTEGER` as array-like', () => {
    function Foo() {}
    Foo.prototype.length = MAX_SAFE_INTEGER + 1;

    expect(isEmpty(new Foo())).toBeTruthy();
  });

  it('should not treat objects with non-number lengths as array-like', () => {
    expect(isEmpty({ length: '0' })).toBeFalsy();
  });
});
