import { ElementRef } from '@angular/core';

export interface HasElementRef {
  _elementRef: ElementRef;
}

export class MixinElementRefBase {
  constructor(public _elementRef: ElementRef<HTMLElement>) {}
}
