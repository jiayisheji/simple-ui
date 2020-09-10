import { asyncFunc, body, document, errors, genFunc } from '@ngx-simple/core/testing';
import { SafeAny } from '@ngx-simple/core/types';
import { clone } from './clone';

describe('clone', function () {
  function Foo() {
    this.a = 1;
  }
  Foo.prototype.b = 1;
  Foo.c = function () {};
  const map = new Map();
  map.set('a', 1);
  map.set('b', 2);
  const set = new Set();
  set.add(1);
  set.add(2);
  const objects = {
    '`arguments` objects': arguments,
    arrays: ['a', ''],
    'array-like objects': { '0': 'a', length: 1 },
    booleans: false,
    'boolean objects': Object(false),
    'date objects': new Date(),
    'Foo instances': new Foo(),
    objects: { a: 0, b: 1, c: 2 },
    'objects with object values': { a: /a/, b: ['B'], c: { C: 1 } },
    'objects from another document': document || {},
    maps: map,
    'null values': null,
    numbers: 0,
    'number objects': Object(0),
    regexes: /a/gim,
    sets: set,
    strings: 'a',
    'string objects': Object('a'),
    'undefined values': undefined
  };

  objects.arrays.length = 3;

  const uncloneable = {
    'DOM elements': body,
    functions: Foo,
    'async functions': asyncFunc,
    'generator functions': genFunc,
    'the `Proxy` constructor': Proxy
  };

  errors.forEach(element => {
    uncloneable[element.name + 's'] = element;
  });

  it('should perform a shallow clone', function () {
    const array = [{ a: 0 }, { b: 1 }],
      actual = clone(array);

    expect(actual).toStrictEqual(array);
  });

  it('should deep clone objects with circular references', function () {
    const object: any = {
      foo: { b: { c: { d: {} } } },
      bar: {}
    };

    object.foo.b.c.d = object;
    object.bar.b = object.foo.b;

    const actual = clone(object);
    expect(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d && actual !== object).toBeTruthy();
  });

  it('should return `{}` values', () => {
    const sym = Symbol('testB');

    const a: SafeAny = {
      a(d: SafeAny, b: SafeAny) {
        console.log(d, b);
      },
      b: 'b',
      c: [1, 2, { a: 1 }]
    };
    a[sym] = 'symbol';
    a.d = a;

    const c = clone(a);
    c.c.push(12);
    expect(a.d).toEqual(a);
    expect(c.d).toEqual(c);
    expect(a.d.c[3]).toBeUndefined();
    expect(c.d.c[3]).toEqual(12);
  });

  it('should return `target` values', () => {
    map.set('key', 'value');
    map.set('Levi', 'code秘密花园');

    set.add('Levi');
    set.add('code秘密花园');

    const target: SafeAny = {
      field1: 1,
      field2: undefined,
      field3: {
        child: 'child'
      },
      field4: [2, 4, 8],
      empty: null,
      map,
      set,
      // tslint:disable-next-line: no-construct
      bool: new Boolean(),
      // tslint:disable-next-line: no-construct
      num: new Number(2),
      // tslint:disable-next-line: no-construct
      str: new String(2),
      symbol: Object(Symbol(1)),
      date: new Date(),
      reg: /\d+/,
      error: new Error(),
      func1: () => {
        console.log(this);
        console.log('code秘密花园');
      },

      func2(a: SafeAny, b: SafeAny) {
        return a + b;
      }
    };

    target.target = target;

    const copy = clone(target);
    expect(copy).toEqual(target);
    target.error.abs = 'error abs';
    expect(copy.error.abs).toEqual(target.error.abs);
    target.num.temp = 'number temp';
    expect(copy.num.temp).toBeUndefined();
  });

  it('should return `class` values', () => {
    class A {
      b = 'A';
      constructor(c: string) {
        this.b = c;
      }
      a() {
        return this.b;
      }
    }

    const B = clone(A);
    const a = new A('this is A');
    const b = new B('this is B');

    expect(a.a).toEqual(b.a);
    expect(a.a()).toEqual('this is A');
    expect(b.a()).toEqual('this is B');
  });
});
