import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

/**
 * 表示主呈现上下文的DI标记。在浏览器中，这表示`localStorage`对象。
 * `注意`:当应用程序和呈现上下文不相同时(例如在Web Worker中运行应用程序时)，localStorage 可能在应用程序上下文中不可用。
 * @example
 * constructor(
 *  @Optional() @Inject(LOCAL_STORAGE) private _localStorage: Storage,
 *  ...
 * )
 */
export const LOCAL_STORAGE = new InjectionToken<Storage>('An abstraction over window.localStorage object', {
  factory: () => inject(WINDOW).localStorage
});
