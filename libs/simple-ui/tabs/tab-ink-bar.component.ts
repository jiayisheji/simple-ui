import { ChangeDetectionStrategy, Component, ElementRef, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sim-tab-ink-bar',
  template: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabInkBarComponent {
  private _element: HTMLElement;

  constructor(_elementRef: ElementRef, private _renderer: Renderer2, private _ngZone: NgZone) {
    _renderer.addClass(_elementRef.nativeElement, 'sim-tab-ink-bar');
    this._element = _elementRef.nativeElement;
  }

  alignToElement(element: HTMLElement) {
    this.show();
    if (typeof requestAnimationFrame !== 'undefined') {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => this._setStyles(element));
      });
    } else {
      this._setStyles(element);
    }
  }

  show(): void {
    this._setVisibility('visible');
  }

  hide(): void {
    this._setVisibility('hidden');
  }

  private _setVisibility(visibility: 'visible' | 'hidden') {
    this._renderer.setStyle(this._element, 'visibility', visibility);
  }

  private _setStyles(element: HTMLElement) {
    let left = '0';
    let width = '0';
    if (element) {
      left = (element.offsetLeft || 0) + 'px';
      width = (element.offsetWidth || 0) + 'px';
    }

    this._renderer.setStyle(this._element, 'left', left);
    this._renderer.setStyle(this._element, 'width', width);
  }
}
