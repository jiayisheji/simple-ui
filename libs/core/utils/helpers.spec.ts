import { SafeAny } from '../types';
import { get, has, omit, pick } from './helpers';

describe('has', () => {
  const a: SafeAny = {
    foo: {
      foz: [1, 2, 3],
      bar: {
        baz: ['a', 'b', 'c']
      }
    },
    field1: 1,
    field2: undefined,
    field3: {
      child: 'child'
    },
    field4: [2, 4, 8],
    empty: null
  };
  it('should return `true` for `has` values', () => {
    expect(has(a, 'empty')).toBeTruthy();
    expect(has(a, 'field1')).toBeTruthy();
    expect(has(a, 'field4')).toBeTruthy();
    expect(has(a, 'field2')).toBeTruthy();
    expect(has(a, 'foo')).toBeTruthy();
  });

  it('should return `false` for `has` values', () => {
    expect(has(a, 'foz')).toBeFalsy();
    expect(has(a, '1')).toBeFalsy();
    expect(has(null, '1')).toBeFalsy();
    expect(has(undefined, '1')).toBeFalsy();
  });
});

describe('omit', () => {
  const a: SafeAny = {
    foo: {
      foz: [1, 2, 3],
      bar: {
        baz: ['a', 'b', 'c']
      }
    },
    field1: 1,
    field2: undefined,
    field3: {
      child: 'child'
    },
    field4: [2, 4, 8],
    empty: null
  };
  it('should return `undefined` for `omit` values', () => {
    expect(omit(a, 'empty').empty).toBeUndefined();
    expect(omit(a, ['foo', 'empty', 'field4', 'field3', 'field1', 'field2', 'foo']).empty).toBeUndefined();
  });

  it('should return `value` for `omit` values', () => {
    expect(omit(a, 'empty').field1).toBe(1);
    expect(omit(a, ['empty', 'field4', 'field3', 'field1', 'field2']).foo.foz[0]).toBe(1);
  });
});

describe('pick', () => {
  const a: SafeAny = {
    foo: {
      foz: [1, 2, 3],
      bar: {
        baz: ['a', 'b', 'c']
      }
    },
    field1: 1,
    field2: undefined,
    field3: {
      child: 'child'
    },
    field4: [2, 4, 8],
    empty: null
  };
  it('should return `undefined` for `pick` values', () => {
    expect((pick(a, 'field1') as SafeAny).empty).toBeUndefined();

    expect((pick(a, ['foo', 'field4', 'field3', 'field1', 'field2', 'foo']) as SafeAny).empty).toBeUndefined();
  });

  it('should return `value` for `pick` values', () => {
    expect(pick(a, 'empty').empty).toBe(null);
    expect(pick(a, ['empty', 'field4', 'field3', 'field1', 'field2']).field1).toBe(1);
  });
});
describe('get', () => {
  const index = 2;

  const data: SafeAny = {
    foo: {
      foz: [1, 2, 3],
      bar: {
        baz: ['a', 'b', 'c']
      }
    }
  };
  it('should return data.foo', () => {
    expect(get<SafeAny, SafeAny>(data, 'foo')).toEqual(data.foo);
  });
  it('should return 3', () => {
    expect(
      get<SafeAny, SafeAny>(data, ['foo', 'foz', index])
    ).toEqual(3);
  });
  it('should return 3', () => {
    expect(get<SafeAny, SafeAny>(data, 'foo.foz[2]')).toEqual(3);
  });
  it('should return test', () => {
    const result = 'test';

    expect(get<SafeAny, string>(data, ['foo', 'bar', 'baz', 8, 'foz'], result)).toEqual(result);
  });
  it('should return null', () => {
    expect(get(data, null)).toEqual(undefined);
  });
});
