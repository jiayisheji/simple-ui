import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

const MODIFIER = '.prevent';
/**
 * Event.preventDefault();
 * @example
 * <button (click.prevent)="fn()">click me</button>
 */
@Injectable()
export class PreventEventPlugin {
  manager: EventManager;

  supports(eventName: string): boolean {
    return eventName.indexOf(MODIFIER) !== -1;
  }

  addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    const prevented = (event: Event) => {
      event.preventDefault();
      handler(event);
    };

    return this.manager.addEventListener(element, eventName.replace(MODIFIER, ''), prevented);
  }

  addGlobalEventListener(element: string, eventName: string, handler: Function): Function {
    const prevented = (event: Event) => {
      event.preventDefault();
      handler(event);
    };

    return this.manager.addGlobalEventListener(element, eventName.replace(MODIFIER, ''), prevented);
  }
}
