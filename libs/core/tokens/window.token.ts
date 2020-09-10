import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

/**
 * 表示主呈现上下文的DI标记。在浏览器中，这表示`Window`对象。
 * `注意`:当应用程序和呈现上下文不相同时(例如在Web Worker中运行应用程序时)，Window可能在应用程序上下文中不可用。
 * @example
 * constructor(
 *  @Optional() @Inject(WINDOW) private _window: Window,
 *  ...
 * )
 */
export const WINDOW = new InjectionToken<Window>('An abstraction over global window object', {
  factory: () => {
    const { defaultView } = inject(DOCUMENT);

    if (!defaultView) {
      throw new Error('Window is not available');
    }

    return defaultView;
  }
});
