import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { CanDisable, mixinDisabled, MixinElementRefBase } from '@ngx-simple/core/common-behaviors';

const _TabLabelWrapperMixinBase = mixinDisabled(MixinElementRefBase);

@Directive({
  selector: '[simTabLabelWrapper]'
})
export class SimTabLabelWrapperDirective extends _TabLabelWrapperMixinBase implements CanDisable {
  @Input()
  @HostBinding('class.sim-tab-label-disabled')
  disabled: boolean;

  private _element: HTMLElement;
  constructor(public elementRef: ElementRef) {
    super(elementRef);
    this._element = elementRef.nativeElement;
  }
  /** 设置当前元素获取焦点 */
  focus(): void {
    this._element.focus();
  }
  /** 获取当前元素的左偏移 */
  getOffsetLeft(): number {
    return this._element.offsetLeft;
  }
  /** 获取当前元素的宽度 */
  getOffsetWidth(): number {
    return this._element.offsetWidth;
  }
}
