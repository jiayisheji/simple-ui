import { OnDestroy } from '@angular/core';
import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constructor } from './constructor';

export interface CanUnsubscribe extends OnDestroy {
  readonly simUnsubscribe$: Subject<void>;
}

export type CanUnsubscribeCtor = Constructor<CanUnsubscribe>;

/**
 * 用来扩充指令的`simUnsubscribe$`属性 指令销毁自动取消订阅
 * - 在rxjs的`.pipe(..., takeUntil(this.simUnsubscribe$))`使用
 * - 注意：如果在组件需要`ngOnDestroy`钩子，需要调用先调用 `super.ngOnDestroy()`
 */
export function mixinUnsubscribe<T extends Constructor<{}>>(base: T): CanUnsubscribeCtor & T {
  return class extends base {
    readonly simUnsubscribe$: Subject<void> = new Subject();

    constructor(...args: SafeAny[]) {
      super(...args);
    }

    ngOnDestroy() {
      this.simUnsubscribe$.next();
      this.simUnsubscribe$.complete();
    }
  };
}

/**
 * 取消订阅操作符 配合`mixinUnsubscribe`使用
 * @example
 * ```
 * rxjs.pipe(pipe1,untilUnmounted(this))
 * ```
 */
export function untilUnmounted<T extends CanUnsubscribe>(destroyInstance: T) {
  return (source: Observable<SafeAny>) => {
    const simUnsubscribe$ = destroyInstance.simUnsubscribe$;
    if (!simUnsubscribe$) {
      throw Error(`need mixinUnsubscribe() mixin`);
    }
    return source.pipe(takeUntil(simUnsubscribe$));
  };
}
