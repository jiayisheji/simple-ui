import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

const MODIFIER = '.stop';
/**
 * Event.stopPropagation();
 * @example
 * <button (click.stop)="fn()">click me</button>
 */
@Injectable()
export class StopEventPlugin {
  manager: EventManager;

  supports(eventName: string): boolean {
    return eventName.indexOf(MODIFIER) !== -1;
  }

  addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    const stopped = (event: Event) => {
      event.stopPropagation();
      handler(event);
    };

    return this.manager.addEventListener(element, eventName.replace(MODIFIER, ''), stopped);
  }

  addGlobalEventListener(element: string, eventName: string, handler: Function): Function {
    const stopped = (event: Event) => {
      event.stopPropagation();
      handler(event);
    };

    return this.manager.addGlobalEventListener(element, eventName.replace(MODIFIER, ''), stopped);
  }
}
