import { InjectionToken, ViewContainerRef } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';

/** 注入令牌，可用于访问传递到toast的数据 */
export const SIM_TOAST_DATA = new InjectionToken<SafeAny>('SimToastData');

/** 水平位置 */
export type SimToastHorizontalPosition = 'start' | 'center' | 'end';

/** 垂直位置 */
export type SimToastVerticalPosition = 'top' | 'center' | 'bottom';

export class SimToastConfig<D = SafeAny> {
  /** toast元素的 ARIA role */
  role?: string = 'alert';

  /** 注入子组件的数据 */
  data?: D | null = null;

  /** 放置toast的水平位置 */
  horizontalPosition?: SimToastHorizontalPosition = 'center';

  /** 放置toast的垂直位置 */
  verticalPosition?: SimToastVerticalPosition = 'bottom';

  /** toast是否有背景。 */
  hasBackdrop?: boolean = false;

  /** 自动关闭toast之前等待的时间（以毫秒为单位） */
  duration?: number = 0;

  /** 浮层面板的自定义类 */
  panelClass?: string | string[];

  /**
   * 附上的组件应该位于Angular的`logical`(逻辑)组件树中。
   * 这将影响可用于注入的内容以及toast内实例化的组件的更改检测顺序。这并不影响toast内容的呈现位置。
   */
  viewContainerRef?: ViewContainerRef;
}
