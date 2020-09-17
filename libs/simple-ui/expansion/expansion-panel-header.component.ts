import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { EMPTY, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { simExpansionAnimations } from './expansion-animations';
import { SimExpansionPanelComponent } from './expansion-panel.component';

@Component({
  selector: 'sim-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrls: ['./expansion.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simExpansionAnimations.expansionHeaderHeight],
  host: {
    class: 'sim-expansion-panel-header',
    '[attr.id]': 'panel && panel._headerId',
    role: 'button'
  }
})
export class SimExpansionPanelHeaderComponent implements OnDestroy, FocusableOption {
  /** 面板展开时标题的高度 */
  @Input() expandedHeight: string;

  /** 面板折叠时标题的高度 */
  @Input() collapsedHeight: string;

  /** 是否应禁用面板标题中的Angular动画 */
  _animationsDisabled = true;

  @HostBinding('class.sim-expansion-panel-header-disabled')
  get disabled(): boolean {
    return this.panel.disabled;
  }

  @HostBinding('class.sim-expansion-panel-header-expanded')
  get expanded(): boolean {
    return this.panel.expanded;
  }
  @HostBinding('class.sim-expansion-toggle-indicator-before')
  get togglePosition(): boolean {
    return this.panel.togglePosition === 'before';
  }

  @HostBinding('@expansionHeight')
  get _expansionHeight() {
    return {
      value: this.panel._getExpandedState(),
      params: {
        collapsedHeight: this.collapsedHeight,
        expandedHeight: this.expandedHeight
      }
    };
  }

  /** 获取是否应显示展开指示符 */
  get _showToggle(): boolean {
    return !this.panel.hideToggle && !this.panel.disabled;
  }

  private _parentChangeSubscription = Subscription.EMPTY;

  constructor(
    @Host() public panel: SimExpansionPanelComponent,
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    const accordionHideToggleChange = panel.expansion
      ? panel.expansion._stateChanges.pipe(filter(changes => !!(changes['hideToggle'] || changes['togglePosition'])))
      : EMPTY;

    this._parentChangeSubscription = merge(
      panel.opened,
      panel.closed,
      accordionHideToggleChange,
      panel._inputChanges.pipe(
        filter(changes => {
          return !!(changes['hideToggle'] || changes['disabled'] || changes['togglePosition']);
        })
      )
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }

  ngOnDestroy(): void {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  @HostListener('click', [])
  clickToggle() {
    if (!this.disabled) {
      this.panel.toggle();
    }
  }

  @HostListener('keydown', ['$event'])
  onkeydown(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    switch (event.keyCode) {
      // 空格键和回车键 调用clickToggle()方法
      case SPACE:
      case ENTER:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this.clickToggle();
        }
        break;
      default:
        if (this.panel.expansion) {
          this.panel.expansion._handleHeaderKeydown(event);
        }
        return;
    }
  }

  @HostListener('@expansionHeight.start')
  animationStarted() {
    this._animationsDisabled = false;
  }

  /**
   * 聚焦面板标题。 Implemented as a part of `FocusableOption`
   */
  focus(origin: FocusOrigin = 'program', options?: FocusOptions) {
    this._focusMonitor.focusVia(this._elementRef, origin, options);
  }
}
