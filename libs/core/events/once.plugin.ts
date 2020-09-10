import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

const MODIFIER = '.once';
/**
 * Once bind Event
 * @example
 * <button (click.once)="fn()">click me</button>
 */
@Injectable()
export class OnceEventPlugin {
  manager: EventManager;

  supports(eventName: string): boolean {
    return eventName.indexOf(MODIFIER) !== -1;
  }

  addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    const fn = this.manager.addEventListener(element, eventName.replace(MODIFIER, ''), (event: Event) => {
      handler(event);
      fn();
    });

    return () => {};
  }

  addGlobalEventListener(element: string, eventName: string, handler: Function): Function {
    const fn = this.manager.addGlobalEventListener(element, eventName.replace(MODIFIER, ''), (event: Event) => {
      handler(event);
      fn();
    });

    return () => {};
  }
}
