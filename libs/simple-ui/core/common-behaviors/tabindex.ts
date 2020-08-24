import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { Constructor } from './constructor';
import { CanDisable } from './disabled';

export interface HasTabIndex {
  /** 组件的tabindex */
  tabIndex: number;
}

/** 混合以‘tabIndex’属性扩充指令 */
export function mixinTabIndex<T extends Constructor<CanDisable>>(base: T, defaultTabIndex = 0): Constructor<HasTabIndex> & T {
  return class extends base {
    private _tabIndex: number = defaultTabIndex;

    get tabIndex(): number {
      return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(value: number) {
      // 如果指定的tabIndex值为null或undefined，则返回默认值。
      this._tabIndex = value != null ? value : defaultTabIndex;
    }

    constructor(...args: SafeAny[]) {
      super(...args);
    }
  };
}
