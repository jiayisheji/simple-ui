import { defer, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
}

/**
 * 自动完成指示器加载操作
 * @param indicator
 * @example <caption>使用示例</caption>
 *
 * ```ts
 * export class UserComponent  {
 *    loading$ = new Subject<boolean>()
 *
 *    constructor(private userService: UserService) {}
 *
 *    findAll() {
 *      this.userService.create(new User(name))
 *         .pipe(indicate(this.loading$))
 *         .subscribe()
 *    }
 * }
 * ```
 *
 * -----------------------------------------
 *
 * ```html
 * <div *ngIf="loading$ | async">
 *    loading...
 * </div>
 * ```
 */
export function indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      prepare(() => indicator.next(true)),
      finalize(() => indicator.next(false))
    );
}
