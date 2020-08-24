import { isPromise } from '@ngx-simple/simple-ui/core/typeof';
import { from, isObservable, Observable, of } from 'rxjs';

/**
 * @description 将数据强制转化成Observable
 * @param value
 * @returns 返回Observable
 */
export function toObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(value)) {
    return value;
  }
  if (isPromise<T>(value)) {
    // Use `Promise.resolve()` to wrap promise-like instances.
    return from(Promise.resolve(value));
  }
  return of(value);
}
