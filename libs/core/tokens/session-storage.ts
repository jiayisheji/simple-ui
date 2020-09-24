import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

/**
 * 表示主呈现上下文的DI标记。在浏览器中，这表示`sessionStorage`对象。
 * `注意`:当应用程序和呈现上下文不相同时(例如在Web Worker中运行应用程序时)，sessionStorage 可能在应用程序上下文中不可用。
 * @example
 * constructor(
 *  @Optional() @Inject(SESSION_STORAGE) private _sessionStorage: Storage,
 *  ...
 * )
 */
export const SESSION_STORAGE = new InjectionToken<Storage>('An abstraction over window.sessionStorage object', {
  factory: () => inject(WINDOW).sessionStorage
});
