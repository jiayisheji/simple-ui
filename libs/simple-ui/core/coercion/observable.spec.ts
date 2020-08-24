import { args, body, primitives, slice, stubTrue, symbol } from '@ngx-simple/simple-ui/testing';
import { from, fromEvent, isObservable, of } from 'rxjs';
import { toObservable } from './observable';

describe('toObservable', () => {
  it('should coerce an any into an Observable', () => {
    const expected = primitives.map(stubTrue);
    const actual = primitives.map(value => isObservable(toObservable(value)));

    expect(actual).toStrictEqual(expected);

    expect(isObservable(toObservable(args))).toBeTruthy();
    expect(isObservable(toObservable([1, 2, 3]))).toBeTruthy();
    expect(isObservable(toObservable(new Date()))).toBeTruthy();
    expect(isObservable(toObservable(new Error()))).toBeTruthy();
    expect(isObservable(toObservable(slice))).toBeTruthy();
    expect(isObservable(toObservable({ a: 1 }))).toBeTruthy();
    expect(isObservable(toObservable(1))).toBeTruthy();
    expect(isObservable(toObservable(/x/))).toBeTruthy();
    expect(isObservable(toObservable('a'))).toBeTruthy();
    expect(isObservable(toObservable(symbol))).toBeTruthy();
    if (body) {
      expect(isObservable(toObservable(body))).toBeTruthy();
    }
  });

  it('should coerce an Promise into an Observable', () => {
    expect(isObservable(toObservable(Promise.resolve(1)))).toBeTruthy();
    expect(isObservable(toObservable(Promise.reject(1)))).toBeTruthy();
  });

  it('should coerce an Observable into an Observable', () => {
    expect(isObservable(toObservable(of(1)))).toBeTruthy();
    expect(isObservable(toObservable(from(Promise.resolve(1))))).toBeTruthy();
    if (body) {
      expect(isObservable(toObservable(fromEvent(body, 'click')))).toBeTruthy();
    }
  });
});
