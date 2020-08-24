import { ElementRef } from '@angular/core';
import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { Constructor } from './constructor';

export interface CanColor {
  /**
   * Implemented as part of CanColor
   * 组件的主题调色板
   */
  color: ThemePalette;
}

/**
 * 主题调色板
 * - primary 主要的
 * - secondary 次要的
 * - success 成功的
 * - info 信息的
 * - warning 警告的
 * - danger 危险的/错误的
 */
export type ThemePalette = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | undefined;

export type CanColorCtor = Constructor<CanColor>;

export interface HasElementRef {
  _elementRef: ElementRef;
}

/**
 * 用来扩展指令的`color`属性
 */
export function mixinColor<T extends Constructor<HasElementRef>>(base: T, defaultColor?: ThemePalette): CanColorCtor & T {
  return class extends base {
    private _color: ThemePalette;

    get color(): ThemePalette {
      return this._color;
    }
    set color(value: ThemePalette) {
      const colorPalette = value;

      if (colorPalette !== this._color) {
        const elementRef = this._elementRef.nativeElement.classList;
        if (this._color) {
          elementRef.remove(`sim-${this._color}`);
        }
        if (colorPalette) {
          elementRef.add(`sim-${colorPalette}`);
        }

        this._color = colorPalette;
      }
    }

    constructor(...args: SafeAny[]) {
      super(...args);
      this.color = defaultColor;
    }
  };
}
