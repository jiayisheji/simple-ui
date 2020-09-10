import { toBoolean } from '@ngx-simple/core/coercion';
import { SafeAny } from '@ngx-simple/core/types';
import { Constructor } from './constructor';

export interface CanDisable {
  /**
   * Implemented as part of CanDisable
   * 组件是否禁用
   */
  disabled: boolean;
}

export type CanDisableCtor = Constructor<CanDisable>;

/**
 * 用来扩充指令`disabled`属性
 */
export function mixinDisabled<T extends Constructor<{}>>(base: T): CanDisableCtor & T {
  return class extends base {
    private _disabled = false;

    get disabled() {
      return this._disabled;
    }
    set disabled(value: SafeAny) {
      this._disabled = toBoolean(value);
    }

    constructor(...args: SafeAny[]) {
      super(...args);
    }
  };
}
