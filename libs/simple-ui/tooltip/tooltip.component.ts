import { AnimationEvent } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { NgClassInterface, NgStringOrTemplateRef } from '@ngx-simple/core/types';
import { Observable, Subject } from 'rxjs';
import { simTooltipAnimations } from './tooltip-animations';

export type TooltipVisibility = 'initial' | 'visible' | 'hidden';

export type TooltipTrigger = 'click' | 'hover' | 'focus';

@Component({
  selector: 'sim-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simTooltipAnimations.tooltipState]
})
export class SimTooltipComponent {
  /** 箭头class */
  positionClass: string;

  /** 消息内容 */
  message: NgStringOrTemplateRef;

  /** 提示面板最大宽度 */
  maxWidth: string;

  trigger: TooltipTrigger;

  /** 自定义面板class */
  panelClass: NgClassInterface;

  /** 动画框架监视的属性，以显示或隐藏文字提示 */
  _visibility: TooltipVisibility = 'initial';

  /** 设置为显示文字提示的计时器的超时ID */
  private _showTimeoutId: number;

  /** 设置为隐藏文字提示的计时器的超时ID */
  private _hideTimeoutId: number;

  /** 页面上的交互是否应该关闭文字提示 */
  private _closeOnInteraction: boolean = false;
  /** 隐藏状态 */
  private _hideState: boolean = true;

  private readonly _onHide: Subject<void> = new Subject();

  private readonly _onHover: Subject<boolean> = new Subject();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  @HostListener('body:click')
  _handleBodyInteraction(): void {
    if (this.trigger === 'click') {
      return;
    }
    if (this._closeOnInteraction) {
      this.hide(0);
    }
  }

  /** 打开处理 */
  show(delay: number = 0) {
    // 取消已存在的关闭定时器
    if (this._hideTimeoutId) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = null;
    }

    this._closeOnInteraction = true;
    this._showTimeoutId = (setTimeout(() => {
      this._visibility = 'visible';
      this._showTimeoutId = null;

      this._markForCheck();
    }, delay) as unknown) as number;
  }

  /** 关闭处理 */
  hide(delay: number = 0) {
    // 取消已存在的显示定时器
    if (this._showTimeoutId) {
      clearTimeout(this._showTimeoutId);
      this._showTimeoutId = null;
    }

    this._hideTimeoutId = (setTimeout(() => {
      if (this._hideState) {
        this._visibility = 'hidden';
        this._hideTimeoutId = null;
        this._markForCheck();
      }
    }, delay) as unknown) as number;
  }

  onMouseEnter() {
    this._hideState = false;
    clearTimeout(this._hideTimeoutId);
    this._onHover.next(true);
  }

  onMouseLeave() {
    this._hideState = true;
    this._onHover.next(false);
  }

  isVisible(): boolean {
    return this._visibility === 'visible';
  }

  setInput<V extends keyof SimTooltipComponent>(key: V, value: this[V]): void {
    this[key] = value;
  }

  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

  afterHidden(): Observable<void> {
    return this._onHide.asObservable();
  }

  hoverToggle(): Observable<boolean> {
    return this._onHover.asObservable();
  }

  _animationStart() {
    this._closeOnInteraction = false;
  }

  _animationDone(event: AnimationEvent): void {
    const toState = event.toState as TooltipVisibility;

    if (toState === 'hidden' && !this.isVisible()) {
      this._onHide.next();
    }

    if (toState === 'visible' || toState === 'hidden') {
      this._closeOnInteraction = true;
    }
  }
}
