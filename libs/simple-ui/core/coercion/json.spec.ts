import { primitives } from '@ngx-simple/simple-ui/testing';
import { toJson } from './json';

describe('toObservable', () => {
  it('should coerce an any not string into an any', () => {
    const expected = primitives.map((value, i) => i);
    const actual = primitives.map(toJson);

    expect(actual).toStrictEqual(expected);
  });

  it('should coerce an string array into an array', () => {
    const expected = [1, 2, 3];

    expect(toJson(JSON.stringify(expected))).toStrictEqual(expected);
  });

  it('should coerce an string object into an object', () => {
    const expected = { a: 1 };

    expect(toJson(JSON.stringify(expected))).toStrictEqual(expected);
  });

  it('should coerce an object into an object', () => {
    const values: [any, any][] = [
      [null, null],
      [{}, {}],
      [[], []],
      [new Error(), new Error()],
      [1, null],
      [undefined, null],
      [true, null],
      [NaN, null]
    ];
    const expected = values.map(value => value[1]);
    const actual = values.map(value => toJson(value[0]));

    expect(actual).toStrictEqual(expected);
  });

  it('should coerce an Unexpected end of JSON input into an fallbackValue', () => {
    const values: [string, any][] = [
      ['', null],
      ['1', 1],
      ['-1', -1]
    ];
    const expected = values.map(value => value[1]);
    const actual = values.map(value => toJson(value[0], value[1]));

    expect(actual).toStrictEqual(expected);

    expect(toJson('')).toBeNull();
  });
});
