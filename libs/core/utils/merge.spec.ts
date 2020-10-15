import { SafeAny } from '../types';
import { isEqual } from './equal';
import { merge } from './merge';

describe('merge', () => {
  it('should merge `source` into `object`', () => {
    const names = {
      characters: [{ name: 'barney' }, { name: 'fred' }]
    };

    const ages = {
      characters: [{ age: 36 }, { age: 40 }]
    };

    const heights = {
      characters: [{ height: '5\'4"' }, { height: '5\'5"' }]
    };

    const expected = {
      characters: [
        { name: 'barney', age: 36, height: '5\'4"' },
        { name: 'fred', age: 40, height: '5\'5"' }
      ]
    };
    expect(merge(names, ages, heights)).toStrictEqual(expected);
  });

  it('should merge sources containing circular references', () => {
    const object = {
      foo: { a: 1 },
      bar: { a: 2 }
    };

    const source = {
      foo: { b: { c: { d: {} } } },
      bar: {}
    };

    source.foo.b.c.d = source;

    (source.bar as SafeAny).b = source.foo.b;

    const actual = merge(object, source);

    expect(actual.foo.b.c.d).toStrictEqual((actual.foo.b.c.d as SafeAny).foo.b.c.d);
  });

  it('should work with four arguments', () => {
    const expected = { a: 4 };
    const actual = merge({ a: 1 }, { a: 2 }, { a: 3 }, expected);

    expect(actual).toStrictEqual(expected);
  });

  it('should merge onto  `object` values', () => {
    function Foo() {}

    const source = { a: 1 };
    const actual = merge(Foo, source);

    expect(actual).toStrictEqual(Foo);

    expect((Foo as SafeAny).a).toStrictEqual(1);
  });

  it('should merge first source object properties to ', () => {
    const fn = () => {};

    const object: SafeAny = { prop: {} };
    const actual = merge({ prop: fn }, object);

    expect(actual).toStrictEqual(object);
  });

  it('should merge first and second source object properties to ', () => {
    const fn = () => {};

    const object: SafeAny = { prop: {} };

    const actual: SafeAny = merge({ prop: fn }, { prop: fn }, object);

    expect(actual).toStrictEqual(object);
  });

  it('should not merge onto  va=> lues of sources', () => {
    const source1: SafeAny = { a() {} };
    const source2 = { a: { b: 2 } };
    const expected = { a: { b: 2 } };
    let actual = merge({}, source1, source2);

    expect(actual).toStrictEqual(expected);

    expect(!('b' in source1.a)).toBeTruthy();

    actual = merge(source1, source2);
    expect(actual).toStrictEqual(expected);
  });

  it('should merge onto non-plain `object` values', () => {
    function Foo() {}

    const object = new Foo();
    const actual = merge(object, { a: 1 });

    expect(actual).toStrictEqual(object);
    expect(object.a).toStrictEqual(1);
  });

  it('should treat sparse array sources as dense', () => {
    const array = [1];
    array[2] = 3;

    const actual = merge([], array);
    const expected = array.slice();

    expected[1] = undefined;

    expect('1' in actual).toBeFalsy();
    expect(actual[0]).toStrictEqual(expected[0]);
    expect(actual[2]).toStrictEqual(expected[2]);
  });

  it('should assign `null` values', () => {
    const actual = merge({ a: 1 }, { a: null });
    expect(actual.a).toStrictEqual(null);
  });

  it('should not overwrite existing values with `undefined` values of object sources', () => {
    const actual = merge({ a: 1 }, { a: undefined, b: undefined });
    expect(actual).toStrictEqual({ a: 1, b: undefined });
  });

  it('should assign non array/buffer/typed-array/plain-object source values directly', () => {
    function Foo() {}

    // tslint:disable-next-line: no-construct
    const values = [new Foo(), new Boolean(), new Date(), Foo, new Number(), new String(), new RegExp(/a/)];
    const expected = values.map(() => true);

    const actual = values.map(value => {
      const object = merge({}, { a: value, b: { c: value } });
      return object.a === value && object.b.c === value;
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should deep clone array/plain-object source values', () => {
    const props = ['0', 'a'];
    const values = [[{ a: 1 }], { a: [1] }];
    const expected = values.map(() => true);

    const actual = values.map((value, index) => {
      const key = props[index];
      const object = merge({}, { value });
      const subValue = value[key];
      const newValue = object.value;
      const newSubValue = newValue[key];

      return newValue !== value && newSubValue !== subValue && isEqual(newValue, value);
    });

    expect(actual).toStrictEqual(expected);
  });
});
