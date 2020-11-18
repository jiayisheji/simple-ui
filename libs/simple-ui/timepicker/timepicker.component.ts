import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  isDevMode,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { toBoolean } from '@ngx-simple/core/coercion';
import { ThemePalette } from '@ngx-simple/core/common-behaviors';
import { SimDateAdapter } from '@ngx-simple/core/datetime';
import { NgClassInterface, SafeAny } from '@ngx-simple/core/types';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DateFilterFn } from './time-view.component';
import { SimTimepickerContentComponent } from './timepicker-content.component';
import { createMissingDateImplError } from './timepicker-errors';
import { SimTimepickerDirective } from './timepicker-input.directive';

/** 注入令牌，用于确定在日历打开时的滚动处理。 */
export const SIM_TIMEPICKER_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('SIM-timepicker-scroll-strategy');

export function SIM_TIMEPICKER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** timepicker下拉菜单在X轴上的可能位置 */
export type TimepickerDropdownPositionX = 'start' | 'end';

/** timepicker下拉菜单在Y轴上可能位置 */
export type TimepickerDropdownPositionY = 'above' | 'below';

export const SIM_TIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SIM_TIMEPICKER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SIM_TIMEPICKER_SCROLL_STRATEGY_FACTORY
};

@Component({
  selector: 'sim-timepicker',
  template: '',
  exportAs: 'simTimepicker',
  styleUrls: ['./timepicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimTimepickerComponent<D> implements OnDestroy {
  /** 在日期选择器的日历上使用的调色板 */
  @Input()
  get color(): ThemePalette {
    return this._color || (this._timepickerInput ? this._timepickerInput.getThemePalette() : undefined);
  }
  set color(value: ThemePalette) {
    this._color = value;
  }
  _color: ThemePalette = 'primary';

  /** 是否禁用日期选择器弹出窗口 */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._timepickerInput ? this._timepickerInput.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = toBoolean(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._stateChanges.next(undefined);
    }
  }
  private _disabled: boolean;

  /** 要传递给时间选择器面板的类。 支持与ngClass相同的语法 */
  @Input() panelClass: NgClassInterface;
  /** 小时选项间隔  */
  @Input() hourStep: number;
  /** 分钟选项间隔  */
  @Input() minuteStep: number;
  /** 秒选项间隔  */
  @Input() secondStep: number;

  /** 打开时间选择器面板后发出事件 */
  @Output() opened: EventEmitter<void> = new EventEmitter();

  /** 关闭时间选择器面板后发出事件 */
  @Output() closed: EventEmitter<void> = new EventEmitter();

  /**
   * 在时间视图中发出选定的时间。这并不意味着对所选时间的更改。
   */
  @Output() readonly timeSelected: EventEmitter<D> = new EventEmitter<D>();

  /** 与此Timepicker关联的<input> */
  _timepickerInput: SimTimepickerDirective<D>;

  _selected: D;

  /** 选定日期更改时发出新选择的日期 */
  readonly _selectedChanged = new Subject<D>();

  /** 对在弹出模式中实例化的组件的引用 */
  private _popupComponentRef: ComponentRef<SimTimepickerContentComponent<D>> | null;
  /** 当时间选择器的状态更改时发出 */
  readonly _stateChanges = new Subject<void>();
  private _panelOpen: boolean;
  private _document: Document;
  private _scrollStrategy: () => ScrollStrategy;

  /** 打开日期选择器之前聚焦的元素 */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  /** 当日历作为弹出窗口打开时，对覆盖层的引用 */
  private _popupRef: OverlayRef | null;
  private _inputSubscription: Subscription;

  constructor(
    private _overlay: Overlay,
    private _ngZone: NgZone,
    protected _viewContainerRef: ViewContainerRef,
    @Inject(SIM_TIMEPICKER_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() protected _dateAdapter: SimDateAdapter<D>,
    @Optional() @Inject(DOCUMENT) document: SafeAny
  ) {
    if (!this._dateAdapter && isDevMode) {
      throw createMissingDateImplError('simDateAdapter');
    }
    this._document = document;
    this._scrollStrategy = scrollStrategy;
  }

  ngOnDestroy() {
    this._inputSubscription.unsubscribe();
    this._destroyPopup();
    this.close();
    this._stateChanges.complete();
  }

  _registerInput(input: SimTimepickerDirective<D>) {
    this._timepickerInput = input;
    this._inputSubscription = this._timepickerInput._valueChange.subscribe((value: D | null) => {
      if (value === null) {
        this._selected = null;
        return;
      }
      this._selected = value;
    });
  }

  /** 可选择的最小日期 */
  _getMinDate(): D | null {
    return this._timepickerInput && this._timepickerInput.min;
  }

  /** 可选择的最大日期 */
  _getMaxDate(): D | null {
    return this._timepickerInput && this._timepickerInput.max;
  }

  /** 可选择过滤后的日期 */
  _getDateFilter(): DateFilterFn<D> {
    return this._timepickerInput && this._timepickerInput.dateFilter;
  }
  /** 可选择过滤后的日期 */
  _getFormat(): string {
    return this._timepickerInput && this._timepickerInput.format;
  }

  /** 选择的时间 */
  select(date: D) {
    this._selected = date;
    this._selectedChanged.next(date);
  }

  /** 选择当前时间 */
  selectNow(event: Event) {
    event.stopPropagation();
    this._timepickerInput.value = this._dateAdapter.today();
    this.close();
  }

  /** 确认选择的时间 */
  selectTime(event: Event) {
    event.stopPropagation();
    this.close();
  }

  open() {
    if (this._panelOpen || this.disabled) {
      return;
    }
    if (!this._timepickerInput && isDevMode) {
      throw Error('Attempted to open an simTimepicker with no associated input.');
    }
    if (this._document) {
      this._focusedElementBeforeOpen = (this._document.activeElement as unknown) as HTMLElement;
    }
    this._openAsPopup();
    this._panelOpen = true;
    this.opened.emit();
  }

  close() {
    if (!this._panelOpen) {
      return;
    }
    if (this._popupComponentRef && this._popupRef) {
      const instance = this._popupComponentRef.instance;
      instance._startExitAnimation();
      instance._animationDone.pipe(take(1)).subscribe(() => this._destroyPopup());
    }

    const completeClose = () => {
      if (this._panelOpen) {
        this._panelOpen = false;
        this.closed.emit();
        this._focusedElementBeforeOpen = null;
      }
    };

    if (this._focusedElementBeforeOpen && typeof this._focusedElementBeforeOpen.focus === 'function') {
      this._focusedElementBeforeOpen.focus();
      const timer = setTimeout(() => {
        completeClose();
        clearTimeout(timer);
      });
    } else {
      completeClose();
    }
  }

  private _openAsPopup() {
    const portal = new ComponentPortal<SimTimepickerContentComponent<D>>(SimTimepickerContentComponent, this._viewContainerRef);
    this._destroyPopup();
    this._createPopup();
    this._popupComponentRef = this._popupRef.attach(portal);
    this._popupComponentRef.instance.timepicker = this;
    this._popupComponentRef.instance.color = this.color;

    // 一旦视图呈现，就更新位置。
    this._ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this._popupRef.updatePosition();
      });
  }

  private _createPopup() {
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._timepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.sim-timepicker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true,
      disposeOnNavigation: true,
      backdropClass: 'sim-overlay-transparent-backdrop',
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'sim-datepicker-popup'
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(
        filter(event => {
          // tslint:disable-next-line: deprecation
          return event.keyCode === ESCAPE || (this._timepickerInput && event.altKey && event.keyCode === UP_ARROW);
        })
      )
    ).subscribe((event: MouseEvent) => {
      if (event) {
        event.preventDefault();
      }

      this.close();
    });
  }

  /** 销毁当前弹出选择器面板浮层 */
  private _destroyPopup() {
    if (this._popupRef) {
      this._popupRef.dispose();
      this._popupRef = this._popupComponentRef = null;
    }
  }
}
