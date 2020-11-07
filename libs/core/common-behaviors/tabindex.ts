import { toNumber } from '@ngx-simple/core/coercion';
import { SafeAny } from '@ngx-simple/core/types';
import { AbstractConstructor, Constructor } from './constructor';
import { CanDisable } from './disabled';

export interface HasTabIndex {
  /** 组件的tabindex */
  tabIndex: number;
  /** 如果没有设置值，要返回到的tabindex。 */
  defaultTabIndex: number;
}

/** @docs-private */
export type HasTabIndexCtor = Constructor<HasTabIndex>;

/** 混合以‘tabIndex’属性扩充指令 */
export function mixinTabIndex<T extends AbstractConstructor<CanDisable>>(base: T, defaultTabIndex = 0): HasTabIndexCtor & T {
  // Note: We cast `base` to `unknown` and then `Constructor`. It could be an abstract class,
  // but given we `extend` it from another class, we can assume a constructor being accessible.
  abstract class Mixin extends ((base as unknown) as Constructor<CanDisable>) {
    private _tabIndex: number = defaultTabIndex;
    defaultTabIndex: number = defaultTabIndex;

    get tabIndex(): number {
      return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(value: number) {
      // 如果指定的tabIndex值为null或undefined，则返回到默认值。
      this._tabIndex = value != null ? toNumber(value) : this.defaultTabIndex;
    }

    constructor(...args: SafeAny[]) {
      super(...args);
    }
  }

  // Since we don't directly extend from `base` with it's original types, and we instruct
  // TypeScript that `T` actually is instantiatable through `new`, the types don't overlap.
  // This is a limitation in TS as abstract classes cannot be typed properly dynamically.
  return (Mixin as unknown) as T & HasTabIndexCtor;
}
