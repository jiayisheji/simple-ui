import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { Constructor } from './constructor';
import { HasElementRef } from './element';

export interface CanSize {
  /**
   * Implemented as part of CanSize
   * 组件的主题调色板
   */
  size: ThemeSize;
}

/**
 * 主题尺寸
 * - large 大的
 * - medium 中的
 * - small 小的
 */
export type ThemeSize = 'small' | 'medium' | 'large' | undefined;

export type CanSizeCtor = Constructor<CanSize>;

/**
 * 用来扩展指令的`color`属性
 */
export function mixinSize<T extends Constructor<HasElementRef>>(base: T, defaultSize?: ThemeSize): CanSizeCtor & T {
  return class extends base {
    private _size: ThemeSize;
    private _nativeElement: HTMLElement;

    get size(): ThemeSize {
      return this._size;
    }
    set size(value: ThemeSize) {
      const sizePalette = value;

      if (sizePalette !== this._size) {
        if (!this._nativeElement) {
          this._nativeElement = this._elementRef.nativeElement;
        }
        const { classList } = this._nativeElement;
        if (this._size) {
          classList.remove(`sim-${this._size}`);
        }
        if (sizePalette) {
          classList.add(`sim-${sizePalette}`);
        }

        this._size = sizePalette;
      }
    }

    constructor(...args: SafeAny[]) {
      super(...args);
      this.size = defaultSize;
    }
  };
}
