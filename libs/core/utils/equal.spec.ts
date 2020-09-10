import { isEqual } from './equal';

describe('isEqual', () => {
  const symbol1 = Symbol('a');
  const symbol2 = Symbol('b');

  it('should compare primitives', () => {
    const pairs = [
      [1, 1, true],
      [1, Object(1), true],
      [1, '1', false],
      [1, 2, false],
      [-0, -0, true],
      [0, 0, true],
      [0, Object(0), true],
      [Object(0), Object(0), true],
      [-0, 0, true],
      [0, '0', false],
      [0, null, false],
      [NaN, NaN, true],
      [NaN, Object(NaN), true],
      [Object(NaN), Object(NaN), true],
      [NaN, 'a', false],
      [NaN, Infinity, false],
      ['a', 'a', true],
      ['a', Object('a'), true],
      [Object('a'), Object('a'), true],
      ['a', 'b', false],
      ['a', ['a'], false],
      [true, true, true],
      [true, Object(true), true],
      [Object(true), Object(true), true],
      [true, 1, false],
      [true, 'a', false],
      [false, false, true],
      [false, Object(false), true],
      [Object(false), Object(false), true],
      [false, 0, false],
      [false, '', false],
      [symbol1, symbol1, true],
      [symbol1, Object(symbol1), true],
      [Object(symbol1), Object(symbol1), true],
      [symbol1, symbol2, false],
      [null, null, true],
      [null, undefined, false],
      [null, {}, false],
      [null, '', false],
      [undefined, undefined, true],
      [undefined, null, false],
      [undefined, '', false]
    ];

    const expected = pairs.map(pair => pair[2]);

    const actual = pairs.map(pair => isEqual(pair[0], pair[1]));

    expect(actual).toStrictEqual(expected);
  });

  it('should compare arrays', () => {
    let array1: any = [true, null, 1, 'a', undefined];
    let array2: any = [true, null, 1, 'a', undefined];

    expect(isEqual(array1, array2)).toBeTruthy();

    array1 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }];
    array2 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }];

    expect(isEqual(array1, array2)).toBeTruthy();

    array1 = [1];
    array1[2] = 3;

    array2 = [1];
    array2[1] = undefined;
    array2[2] = 3;

    expect(isEqual(array1, array2)).toBeTruthy();

    array1 = [Object(1), false, Object('a'), /x/, new Date(2012, 4, 23), ['a', 'b', [Object('c')]], { a: 1 }];
    array2 = [1, Object(false), 'a', /x/, new Date(2012, 4, 23), ['a', Object('b'), ['c']], { a: 1 }];

    expect(isEqual(array1, array2)).toBeTruthy();

    array1 = [1, 2, 3];
    array2 = [3, 2, 1];

    expect(isEqual(array1, array2)).toBeFalsy();

    array1 = [1, 2];
    array2 = [1, 2, 3];

    expect(isEqual(array1, array2)).toBeFalsy();
  });

  it('should treat arrays with identical values but different non-index properties as equal', () => {
    let array1: any = [1, 2, 3],
      array2: any = [1, 2, 3];

    // tslint:disable-next-line: max-line-length
    array1.every = array1.filter = array1.forEach = array1.indexOf = array1.lastIndexOf = array1.map = array1.some = array1.reduce = array1.reduceRight = null;

    // tslint:disable-next-line: max-line-length
    array2.concat = array2.join = array2.pop = array2.reverse = array2.shift = array2.slice = array2.sort = array2.splice = array2.unshift = null;

    expect(isEqual(array1, array2)).toBeTruthy();

    array1 = [1, 2, 3];
    array1.a = 1;

    array2 = [1, 2, 3];
    array2.b = 1;

    expect(isEqual(array1, array2)).toBeTruthy();

    array1 = /c/.exec('abcde');
    array2 = ['c'];

    expect(isEqual(array1, array2)).toBeTruthy();
  });

  it('should compare sparse arrays', () => {
    const array = Array(1);

    expect(isEqual(array, Array(1))).toBeTruthy();
    expect(isEqual(array, [undefined])).toBeTruthy();
    expect(isEqual(array, Array(2))).toBeFalsy();
  });

  it('should compare plain objects', () => {
    let object1: any = { a: true, b: null, c: 1, d: 'a', e: undefined };
    let object2: any = { a: true, b: null, c: 1, d: 'a', e: undefined };

    expect(isEqual(object1, object2)).toBeTruthy();

    object1 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } };
    object2 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } };

    expect(isEqual(object1, object2)).toBeTruthy();

    object1 = { a: 1, b: 2, c: 3 };
    object2 = { a: 3, b: 2, c: 1 };

    expect(isEqual(object1, object2)).toBeFalsy();

    object1 = { a: 1, b: 2, c: 3 };
    object2 = { d: 1, e: 2, f: 3 };

    expect(isEqual(object1, object2)).toBeFalsy();

    object1 = { a: 1, b: 2 };
    object2 = { a: 1, b: 2, c: 3 };

    expect(isEqual(object1, object2)).toBeFalsy();
  });

  it('should compare objects regardless of key order', () => {
    const object1 = { a: 1, b: 2, c: 3 },
      object2 = { c: 3, a: 1, b: 2 };

    expect(isEqual(object1, object2)).toBeTruthy();
  });

  it('should compare nested objects', () => {
    const noop = () => {};

    const object1 = {
      a: [1, 2, 3],
      b: true,
      c: Object(1),
      d: 'a',
      e: {
        f: ['a', Object('b'), 'c'],
        g: Object(false),
        h: new Date(2012, 4, 23),
        i: noop,
        j: 'a'
      }
    };

    const object2 = {
      a: [1, Object(2), 3],
      b: Object(true),
      c: 1,
      d: Object('a'),
      e: {
        f: ['a', 'b', 'c'],
        g: false,
        h: new Date(2012, 4, 23),
        i: noop,
        j: 'a'
      }
    };

    expect(isEqual(object1, object2)).toBeTruthy();
  });

  it('should compare object instances', () => {
    function Foo() {
      this.a = 1;
    }
    Foo.prototype.a = 1;

    function Bar() {
      this.a = 1;
    }
    Bar.prototype.a = 2;

    expect(isEqual(new Foo(), new Foo())).toBeTruthy();
    expect(isEqual(new Foo(), new Bar())).toBeFalsy();
    expect(isEqual({ a: 1 }, new Foo())).toBeFalsy();
    expect(isEqual({ a: 2 }, new Bar())).toBeFalsy();
  });

  it('should compare objects with constructor properties', () => {
    expect(isEqual({ constructor: 1 }, { constructor: 1 })).toBeTruthy();
    expect(isEqual({ constructor: 1 }, { constructor: '1' })).toBeFalsy();
    expect(isEqual({ constructor: [1] }, { constructor: [1] })).toBeTruthy();
    expect(isEqual({ constructor: [1] }, { constructor: ['1'] })).toBeFalsy();
    expect(isEqual({ constructor: Object }, {})).toBeFalsy();
  });

  it('should compare arrays with circular references', () => {
    let array1 = [],
      array2 = [];

    array1.push(array1);
    array2.push(array2);

    expect(isEqual(array1, array2)).toBeTruthy();

    array1.push('b');
    array2.push('b');

    expect(isEqual(array1, array2)).toBeTruthy();

    array1.push('c');
    array2.push('d');

    expect(isEqual(array1, array2)).toBeFalsy();

    array1 = ['a', 'b', 'c'];
    array1[1] = array1;
    array2 = ['a', ['a', 'b', 'c'], 'c'];

    expect(isEqual(array1, array2)).toBeFalsy();
  });

  it('should have transitive equivalence for circular references of arrays', () => {
    const array1 = [],
      array2 = [array1],
      array3 = [array2];

    array1[0] = array1;

    expect(isEqual(array1, array2)).toBeTruthy();
    expect(isEqual(array2, array3)).toBeTruthy();
    expect(isEqual(array1, array3)).toBeTruthy();
  });

  it('should compare objects with circular references', () => {
    let object1: any = {};
    let object2: any = {};

    object1.a = object1;
    object2.a = object2;

    expect(isEqual(object1, object2)).toBeTruthy();

    object1.b = 0;
    object2.b = Object(0);

    expect(isEqual(object1, object2)).toBeTruthy();

    object1.c = Object(1);
    object2.c = Object(2);

    expect(isEqual(object1, object2)).toBeFalsy();

    object1 = { a: 1, b: 2, c: 3 };
    object1.b = object1;
    object2 = { a: 1, b: { a: 1, b: 2, c: 3 }, c: 3 };

    expect(isEqual(object1, object2)).toBeFalsy();
  });

  it('should have transitive equivalence for circular references of objects', () => {
    const object1: any = {};
    const object2: any = { a: object1 };
    const object3: any = { a: object2 };

    object1.a = object1;

    expect(isEqual(object1, object2)).toBeTruthy();
    expect(isEqual(object2, object3)).toBeTruthy();
    expect(isEqual(object1, object3)).toBeTruthy();
  });

  it('should compare objects with multiple circular references', () => {
    const array1: any = [{}];
    const array2: any = [{}];

    (array1[0].a = array1).push(array1);
    (array2[0].a = array2).push(array2);

    expect(isEqual(array1, array2)).toBeTruthy();

    array1[0].b = 0;
    array2[0].b = Object(0);

    expect(isEqual(array1, array2)).toBeTruthy();

    array1[0].c = Object(1);
    array2[0].c = Object(2);

    expect(isEqual(array1, array2)).toBeFalsy();
  });

  it('should compare objects with complex circular references', () => {
    const object1: any = {
      foo: { b: { c: { d: {} } } },
      bar: { a: 2 }
    };

    const object2: any = {
      foo: { b: { c: { d: {} } } },
      bar: { a: 2 }
    };

    object1.foo.b.c.d = object1;
    object1.bar.b = object1.foo.b;

    object2.foo.b.c.d = object2;
    object2.bar.b = object2.foo.b;

    expect(isEqual(object1, object2)).toBeTruthy();
  });

  it('should compare objects with shared property values', () => {
    const object1: any = {
      a: [1, 2]
    };

    const object2: any = {
      a: [1, 2],
      b: [1, 2]
    };

    object1.b = object1.a;

    expect(isEqual(object1, object2)).toBeTruthy();
  });

  it('should treat objects created by `Object.create(null)` like plain objects', () => {
    function Foo() {
      this.a = 1;
    }
    Foo.prototype.constructor = null;

    const object1 = Object.create(null);
    object1.a = 1;

    const object2 = { a: 1 };

    expect(isEqual(object1, object2)).toBeTruthy();
    expect(isEqual(new Foo(), object2)).toBeFalsy();
  });

  it('should avoid common type coercions', () => {
    expect(isEqual(true, Object(false))).toBeFalsy();
    expect(isEqual(Object(false), Object(0))).toBeFalsy();
    expect(isEqual(false, Object(''))).toBeFalsy();
    expect(isEqual(Object(36), Object('36'))).toBeFalsy();
    expect(isEqual(0, '')).toBeFalsy();
    expect(isEqual(1, true)).toBeFalsy();
    expect(isEqual(1337756400000, new Date(2012, 4, 23))).toBeFalsy();
    expect(isEqual('36', 36)).toBeFalsy();
    expect(isEqual(36, '36')).toBeFalsy();
  });

  it('should compare `arguments` objects', () => {
    const args1 = (function () {
        return arguments;
      })(),
      args2 = (function () {
        return arguments;
      })(),
      args3 = function () {
        return arguments;
      }.call(null, 1, 1);

    expect(isEqual(args1, args2)).toBeTruthy();
    expect(isEqual(args1, args3)).toBeFalsy();
  });

  it('should treat `arguments` objects like `Object` objects', () => {
    const object = { '0': 1, '1': 2, '2': 3 };

    const args = { '0': 1, '1': 2, '2': 3 };

    function Foo() {}
    Foo.prototype = object;

    expect(isEqual(args, object)).toBeTruthy();
    expect(isEqual(object, args)).toBeTruthy();
    expect(isEqual(args, new Foo())).toBeFalsy();
    expect(isEqual(new Foo(), args)).toBeFalsy();
  });

  it('should compare date objects', () => {
    const date = new Date(2012, 4, 23);

    expect(isEqual(date, new Date(2012, 4, 23))).toBeTruthy();
    expect(isEqual(new Date('a'), new Date('b'))).toBeTruthy();
    expect(isEqual(date, new Date(2013, 3, 25))).toBeFalsy();
    expect(isEqual(date, { getTime: +date })).toBeFalsy();
  });

  it('should compare error objects', () => {
    const pairs = ['Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'].map(
      (type, index, errorTypes) => {
        const otherType = errorTypes[++index % errorTypes.length],
          CtorA = global[type],
          CtorB = global[otherType];

        return [new CtorA('a'), new CtorA('a'), new CtorB('a'), new CtorB('b')];
      }
    );

    const expected = pairs.map(() => [true, false, false]);

    const actual = pairs.map(pair => {
      return [isEqual(pair[0], pair[1]), isEqual(pair[0], pair[2]), isEqual(pair[2], pair[3])];
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should compare functions', () => {
    function a() {
      return 1 + 2;
    }
    function b() {
      return 1 + 2;
    }

    expect(isEqual(a, a)).toBeTruthy();
    expect(isEqual(a, b)).toBeFalsy();
  });

  it('should compare maps', () => {
    if (Map) {
      const map1 = new Map(),
        map2 = new Map();

      map1.set('a', 1);
      map2.set('b', 2);
      expect(isEqual(map1, map2)).toBeFalsy();

      map1.set('b', 2);
      map2.set('a', 1);
      expect(isEqual(map1, map2)).toBeTruthy();

      map1.delete('a');
      map1.set('a', 1);
      expect(isEqual(map1, map2)).toBeTruthy();

      map2.delete('a');
      expect(isEqual(map1, map2)).toBeFalsy();

      map1.clear();
      map2.clear();
    }
  });

  it('should compare maps with circular references', () => {
    if (Map) {
      const map1 = new Map(),
        map2 = new Map();

      map1.set('a', map1);
      map2.set('a', map2);
      expect(isEqual(map1, map2)).toBeTruthy();

      map1.set('b', 1);
      map2.set('b', 2);
      expect(isEqual(map1, map2)).toBeFalsy();
    }
  });

  it('should compare promises by reference', () => {
    if (Promise) {
      const promise1 = Promise.resolve(1),
        promise2 = Promise.resolve(1);

      expect(isEqual(promise1, promise2)).toBeFalsy();
      expect(isEqual(promise1, promise1)).toBeTruthy();
    }
  });

  it('should compare regexes', () => {
    expect(isEqual(/x/gim, /x/gim)).toBeTruthy();
    expect(isEqual(/x/gim, /x/gim)).toBeTruthy();
    expect(isEqual(/x/gi, /x/g)).toBeFalsy();
    expect(isEqual(/x/, /y/)).toBeFalsy();
    expect(isEqual(/x/g, { global: true, ignoreCase: false, multiline: false, source: 'x' })).toBeFalsy();
  });

  it('should compare sets', () => {
    if (Set) {
      const set1 = new Set(),
        set2 = new Set();

      set1.add(1);
      set2.add(2);
      expect(isEqual(set1, set2)).toBeFalsy();

      set1.add(2);
      set2.add(1);
      expect(isEqual(set1, set2)).toBeTruthy();

      set1.delete(1);
      set1.add(1);
      expect(isEqual(set1, set2)).toBeTruthy();

      set2.delete(1);
      expect(isEqual(set1, set2)).toBeFalsy();

      set1.clear();
      set2.clear();
    }
  });

  it('should compare sets with circular references', () => {
    if (Set) {
      const set1 = new Set(),
        set2 = new Set();

      set1.add(set1);
      set2.add(set2);
      expect(isEqual(set1, set2)).toBeTruthy();

      set1.add(1);
      set2.add(2);
      expect(isEqual(set1, set2)).toBeFalsy();

      set1.clear();
      set2.clear();
    }
  });

  it('should compare symbol properties', () => {
    if (Symbol) {
      const object1: any = { a: 1 };
      const object2: any = { a: 1 };

      object1[symbol1] = { a: { b: 2 } };
      object2[symbol1] = { a: { b: 2 } };

      Object.defineProperty(object2, symbol2, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: 2
      });

      expect(isEqual(object1, object2)).toBeTruthy();

      object2[symbol1] = { a: 1 };
      expect(isEqual(object1, object2)).toBeFalsy();

      delete object2[symbol1];
      object2[Symbol('a')] = { a: { b: 2 } };
      expect(isEqual(object1, object2)).toBeFalsy();
    }
  });

  it('should compare symbol for undefined', () => {
    if (Symbol) {
      const object1: any = { a: 1 };
      const object2: any = { a: 1 };

      object1[symbol1] = { a: { b: 2 } };
      object2[symbol1] = { a: { b: 2 } };

      Object.defineProperty(object2, symbol2, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: 2
      });

      Symbol = undefined;

      expect(isEqual(object1, object2)).toBeTruthy();

      object2[symbol1] = { a: 1 };
      expect(isEqual(object1, object2)).toBeFalsy();
    }
  });

  it('should compare wrapped values', () => {
    const stamp = +new Date();

    const values = [
      [
        [1, 2],
        [1, 2],
        [1, 2, 3]
      ],
      [true, true, false],
      [new Date(stamp), new Date(stamp), new Date(stamp - 100)],
      [
        { a: 1, b: 2 },
        { a: 1, b: 2 },
        { a: 1, b: 1 }
      ],
      [1, 1, 2],
      [NaN, NaN, Infinity],
      [/x/, /x/, /x/i],
      ['a', 'a', 'A']
    ];

    values.forEach(value => {
      let wrapped1 = Object(value[0]),
        wrapped2 = Object(value[1]),
        actual = isEqual(wrapped1, wrapped2);

      expect(actual).toBeTruthy();
      expect(isEqual(Object(actual), Object(true))).toBeTruthy();

      wrapped1 = Object(value[0]);
      wrapped2 = Object(value[2]);

      actual = isEqual(wrapped1, wrapped2);
      expect(actual).toBeFalsy();
      expect(isEqual(Object(actual), Object(false))).toBeTruthy();
    });
  });

  it('should compare wrapped and non-wrapped values', () => {
    let object1 = Object({ a: 1, b: 2 }),
      object2 = { a: 1, b: 2 };

    expect(isEqual(object1, object2)).toBeTruthy();

    object1 = Object({ a: 1, b: 2 });
    object2 = { a: 1, b: 1 };

    expect(isEqual(object1, object2)).toBeFalsy();
  });

  it('should work as an iteratee for `every`', () => {
    const actual = [1, 1, 1].every(v => isEqual(v, 1));
    expect(actual).toBeTruthy();
  });

  it('should not error on DOM elements', () => {
    if (document) {
      const element1 = document.createElement('div'),
        element2 = element1.cloneNode(true);

      try {
        expect(isEqual(element1, element2)).toBeFalsy();
      } catch (e) {
        console.log(e.message);
      }
    }
  });

  it('should return `true` for like-objects from different documents', () => {
    expect(isEqual([1], [1])).toBeTruthy();
    expect(isEqual([2], [1])).toBeFalsy();
    expect(isEqual({ a: 1 }, { a: 1 })).toBeTruthy();
    expect(isEqual({ a: 2 }, { a: 1 })).toBeFalsy();
  });

  it('should return `false` for objects with custom `toString` methods', () => {
    let primitive: any;
    const object = {
      toString: () => {
        return primitive;
      }
    };
    const values = [true, null, 1, 'a', undefined];
    const expected = values.map(() => false);
    const actual = values.map(value => {
      primitive = value;
      return isEqual(object, value);
    });
    expect(actual).toStrictEqual(expected);
  });
});
