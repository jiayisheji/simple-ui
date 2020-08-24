import { args, primitives, stubTrue } from '@ngx-simple/simple-ui/testing';
import { isPrimitive } from './primitive';

describe('isPrimitive', function () {
  it('should return `true` for primitive', function () {
    const expected = primitives.map(stubTrue);
    const actual = primitives.map(isPrimitive);

    expect(actual).toStrictEqual(expected);
  });

  it('should return `false` for primitive', function () {
    expect(isPrimitive(args)).toBeFalsy();
    expect(isPrimitive([1, 2, 3])).toBeFalsy();
    // tslint:disable-next-line: no-construct
    expect(isPrimitive(new Number(1))).toBeFalsy();
    // tslint:disable-next-line: no-construct
    expect(isPrimitive(new String('12'))).toBeFalsy();
    // tslint:disable-next-line: no-construct
    expect(isPrimitive(new Boolean(false))).toBeFalsy();
    expect(isPrimitive(Object(false))).toBeFalsy();
    expect(isPrimitive(new Date())).toBeFalsy();
    expect(isPrimitive(new Error())).toBeFalsy();
    expect(isPrimitive({ a: 1 })).toBeFalsy();
    expect(isPrimitive(Object(0))).toBeFalsy();
    expect(isPrimitive(/x/)).toBeFalsy();
    expect(isPrimitive(Object('a'))).toBeFalsy();
  });
});
