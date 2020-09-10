import {
  FlexibleConnectedPositionStrategy,
  HorizontalConnectionPos,
  OriginConnectionPosition,
  Overlay,
  OverlayConnectionPosition,
  OverlayRef,
  ScrollDispatcher,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { toBoolean } from '@ngx-simple/core/coercion';
import { MixinElementRefBase, mixinUnsubscribe, untilUnmounted } from '@ngx-simple/core/common-behaviors';
import { InputNumber } from '@ngx-simple/core/decorators';
import { POSITION_MAP } from '@ngx-simple/core/overlay';
import { NgClassInterface, NgStringOrTemplateRef, SafeAny } from '@ngx-simple/core/types';
import { take, takeUntil } from 'rxjs/operators';
import { SimTooltipComponent, TooltipTrigger } from './tooltip.component';

/**
 * 显示位置
 * top 始终显示在元素上方 默认显示居中
 * bottom 始终显示在元素下方 默认显示居中
 * left 始终显示在元素左侧 默认显示居中
 * right 始终显示在元素右侧 默认显示居中
 * start 水平方向左对齐 垂直方向上对齐
 * end 水平方向右对齐 垂直方向下对齐
 */
export type TooltipPosition =
  | 'top'
  | 'topStart'
  | 'topEnd'
  | 'bottom'
  | 'bottomStart'
  | 'bottomEnd'
  | 'left'
  | 'leftStart'
  | 'leftEnd'
  | 'right'
  | 'rightStart'
  | 'rightEnd';

/** SimTooltip 默认配置选项 */
export interface SimTooltipDefaultOptions {
  hideDelay: number;
  position?: TooltipPosition;
  showDelay: number;
  width?: string;
}

export const SIM_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken<SimTooltipDefaultOptions>('SIM_TOOLTIP_DEFAULT_OPTIONS', {
  providedIn: 'root',
  factory: SIM_TOOLTIP_DEFAULT_OPTIONS_FACTORY
});

export function SIM_TOOLTIP_DEFAULT_OPTIONS_FACTORY(): SimTooltipDefaultOptions {
  return {
    showDelay: 0,
    hideDelay: 0
  };
}

const _TooltipMixinBase = mixinUnsubscribe(MixinElementRefBase);

const INVERT_POSITION_X = {
  end: 'start',
  start: 'end'
};
const INVERT_POSITION_Y = {
  top: 'bottom',
  bottom: 'top'
};

@Directive({
  selector: '[simTooltip]',
  exportAs: 'simTooltip'
})
export class SimTooltipDirective extends _TooltipMixinBase implements AfterViewInit, OnDestroy {
  @Input('simTooltip')
  get message(): string | TemplateRef<SafeAny> {
    return this._message;
  }
  set message(value: string | TemplateRef<SafeAny>) {
    // 处理自定义模板
    if (value instanceof TemplateRef) {
      this._message = value;
    } else {
      // 处理字符串情况
      this._message = (value || '').trim();
    }
    if (!this._message && this._isTooltipVisible()) {
      this.hide(0);
    } else {
      this._registerTriggers();
      this._updateTooltipMessage();
    }
  }

  /** tooltip相对于元素的位置 */
  @Input('simTooltipPosition')
  get position(): TooltipPosition {
    return this._position;
  }
  set position(value: TooltipPosition) {
    if (value !== this._position) {
      this._position = value;
      if (this._overlayRef) {
        this._updatePosition();

        if (this._tooltipInstance) {
          this._tooltipInstance.show(0);
        }

        this._overlayRef.updatePosition();
      }
    }
  }

  /** 是否禁用 */
  @Input('simTooltipDisabled')
  @HostBinding('class.sim-tooltip-trigger-disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = toBoolean(value);

    if (this._disabled) {
      this.hide(0);
    } else {
      this._registerTriggers();
    }
  }
  private _disabled: boolean;

  /** 隐藏延迟毫秒数 默认0 */
  @Input()
  @InputNumber<SimTooltipDirective, 'simTooltipHideDelay'>()
  simTooltipHideDelay: number;

  /** 内容最大宽度，默认250px，需要带单位px或vw */
  @Input() simTooltipWidth: string;

  /** 要传递给选择面板的类。支持"ngClass"相同的语法 */
  @Input()
  get simTooltipPanelClass(): NgClassInterface {
    return this._simTooltipPanelClass;
  }
  set simTooltipPanelClass(value: NgClassInterface) {
    if (this._simTooltipPanelClass !== value) {
      this._setTooltipComponentInput('panelClass', this.simTooltipPanelClass);
    }
  }
  private _simTooltipPanelClass: NgClassInterface;

  /** 显示延迟毫秒数 默认0 */
  @Input()
  @InputNumber<SimTooltipDirective, 'simTooltipShowDelay'>()
  simTooltipShowDelay: number;

  /** 触发动作 默认hover */
  @Input('simTooltipTrigger') trigger: TooltipTrigger = 'hover';

  private _delayTimer: number;

  private _message: NgStringOrTemplateRef;

  private _overlayRef: OverlayRef | null;

  private _portal: ComponentPortal<SimTooltipComponent>;

  private _position: TooltipPosition;

  private _tooltipInstance: SimTooltipComponent;

  private _triggerDisposables: Array<() => void> = [];

  private _viewInitialized: boolean;

  constructor(
    _elementRef: ElementRef,
    private _overlay: Overlay,
    private _renderer: Renderer2,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    private _scrollDispatcher: ScrollDispatcher,
    @Inject(SIM_TOOLTIP_DEFAULT_OPTIONS)
    private _defaultOptions: SimTooltipDefaultOptions
  ) {
    super(_elementRef);
    _renderer.addClass(_elementRef.nativeElement, 'sim-tooltip-trigger');
    this.simTooltipShowDelay = _defaultOptions.showDelay;
    this.simTooltipHideDelay = _defaultOptions.hideDelay;
    this.position = _defaultOptions.position || 'top';
    this.simTooltipWidth = _defaultOptions.width;
  }

  _isTooltipVisible(): boolean {
    return !!this._tooltipInstance && this._tooltipInstance.isVisible();
  }

  /**
   * 关闭tooltip
   */
  hide(delay: number = this.simTooltipHideDelay): void {
    if (this._tooltipInstance) {
      this._tooltipInstance.hide(delay);
    }
  }

  ngAfterViewInit(): void {
    this._viewInitialized = true;
    this._registerTriggers();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removeTriggerListeners();
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._tooltipInstance = null;
    }
  }

  /**
   * 打开tooltip
   */
  show(delay: number = this.simTooltipShowDelay): void {
    /** 禁用或者没有提示内容 */
    if (this.disabled || !this.message) {
      return;
    }

    if (!this._tooltipInstance) {
      this._createComponent();
      this._setPositionClass();
    }

    this._updateTooltipMessage();
    this._setTooltipComponentInput('panelClass', this.simTooltipPanelClass);
    this._setTooltipComponentInput('maxWidth', this.simTooltipWidth);
    this._setTooltipComponentInput('trigger', this.trigger);
    this._tooltipInstance.show(delay);
  }

  toggle() {
    this._isTooltipVisible() ? this.show() : this.hide();
  }

  private _createComponent() {
    const overlayRef = this._createOverlay();

    this._portal = this._portal || new ComponentPortal(SimTooltipComponent, this._viewContainerRef);
    this._tooltipInstance = overlayRef.attach(this._portal).instance;
    this._tooltipInstance
      .afterHidden()
      .pipe(untilUnmounted(this))
      .subscribe(() => this._detach());

    this._tooltipInstance
      .hoverToggle()
      .pipe(untilUnmounted(this))
      .subscribe(hover => {
        this._delayEnterLeave(false, hover);
      });
  }

  private _createOverlay() {
    if (this._overlayRef) {
      return this._overlayRef;
    }

    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withTransformOriginOn('.sim-tooltip')
      .withFlexibleDimensions(false)
      .withViewportMargin(8);

    const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);
    strategy.withScrollableContainers(scrollableAncestors);

    strategy.positionChanges.pipe(untilUnmounted(this)).subscribe(change => {
      if (this._tooltipInstance) {
        if (change.scrollableViewProperties.isOverlayClipped && this._tooltipInstance.isVisible()) {
          // 在位置变化发生后，覆盖被父可滚动剪切，然后关闭工具提示。
          this._ngZone.run(() => this.hide(0));
        }
      }
    });

    this._overlayRef = this._overlay.create({
      hasBackdrop: this.trigger === 'click',
      positionStrategy: strategy,
      panelClass: 'sim-tooltip-panel',
      backdropClass: '',
      disposeOnNavigation: true,
      scrollStrategy: this._overlay.scrollStrategies.reposition({ scrollThrottle: 20 })
    });

    this._updatePosition();

    this._overlayRef
      .backdropClick()
      .pipe(untilUnmounted(this))
      .subscribe(() => this.hide(0));

    return this._overlayRef;
  }

  /** 分离当前附加的文字提示  */
  private _detach() {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }

    this._tooltipInstance = null;
  }

  private _getOriginAndOverlayPosition(): {
    origin: {
      fallback: OriginConnectionPosition;
      main: OriginConnectionPosition;
    };
    overlay: {
      fallback: OverlayConnectionPosition;
      main: OverlayConnectionPosition;
    };
  } {
    const position = POSITION_MAP[this.position];
    if (!position) {
      // 如果用户提供了无效的tooltip位置，则创建要引发的错误
      throw Error(`Tooltip position "${position}" is invalid.`);
    }
    const originPosition: OriginConnectionPosition = {
      originX: position.originX,
      originY: position.originY
    };
    const overlayPosition: OverlayConnectionPosition = {
      overlayX: position.overlayX,
      overlayY: position.overlayY
    };
    const { x: originX, y: originY } = this._invertPosition(originPosition.originX, originPosition.originY);
    const { x: overlayX, y: overlayY } = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY);
    return {
      origin: {
        main: originPosition,
        fallback: { originX, originY }
      },
      overlay: {
        main: overlayPosition,
        fallback: { overlayX, overlayY }
      }
    };
  }

  /** 更新当前工具提示的位置 */
  private _updatePosition() {
    const position = this._overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
    const { origin, overlay } = this._getOriginAndOverlayPosition();

    position.withPositions([
      { ...origin.main, ...overlay.main },
      { ...origin.fallback, ...overlay.fallback }
    ]);

    this._setPositionClass();
  }

  /** 反转叠加位置 */
  private _invertPosition(x: HorizontalConnectionPos, y: VerticalConnectionPos) {
    if (/^(top|bottom)/.test(this.position)) {
      y = INVERT_POSITION_Y[y];
    } else {
      x = INVERT_POSITION_X[x];
    }
    return { x, y };
  }

  /** 为 sim-tooltip 设置属性并强制更新检查 */
  private _setTooltipComponentInput<V extends keyof SimTooltipComponent>(key: V, value: SimTooltipComponent[V]): void {
    if (this._tooltipInstance) {
      this._tooltipInstance.setInput(key, value);
      this._tooltipInstance._markForCheck();
    }
  }

  private _setPositionClass() {
    this._setTooltipComponentInput(
      'positionClass',
      `sim-tooltip-content-${this.position.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()}`
    );
  }

  private _updateTooltipMessage() {
    // 必须等待消息被绘制到工具提示，以便覆盖层可以根据文本的大小正确计算正确的位置。
    if (this._tooltipInstance) {
      this._tooltipInstance.message = this.message;
      this._tooltipInstance._markForCheck();

      this._ngZone.onMicrotaskEmpty
        .asObservable()
        .pipe(take(1), takeUntil(this.simUnsubscribe$))
        .subscribe(() => {
          if (this._tooltipInstance) {
            this._overlayRef.updatePosition();
          }
        });
    }
  }

  private _delayEnterLeave(isOrigin: boolean, isEnter: boolean, delay: number = 0): void {
    if (this._delayTimer) {
      // 清除延时时间内的计时器
      clearTimeout(this._delayTimer);
      this._delayTimer = null;
    } else if (delay > 0) {
      this._delayTimer = (setTimeout(() => {
        this._delayTimer = null;
        isEnter ? this.show() : this.hide();
      }, delay) as unknown) as number;
    } else {
      isEnter && isOrigin ? this.show() : this.hide();
    }
  }

  private _registerTriggers() {
    if (this._disabled || !this.message || !this._viewInitialized || this._triggerDisposables.length) {
      return;
    }

    const element: HTMLElement = this._elementRef.nativeElement;
    this._removeTriggerListeners();
    const _manualListeners = new Map<string, (e?: Event) => void>();
    switch (this.trigger) {
      case 'hover':
        _manualListeners.set('mouseenter', () => this._delayEnterLeave(true, true, 150));
        _manualListeners.set('mouseleave', () => this._delayEnterLeave(true, false, 100));
        break;
      case 'click':
        _manualListeners.set('click', e => {
          e.preventDefault();
          this.show();
        });
        break;
      case 'focus':
        _manualListeners.set('focus', () => this.show());
        _manualListeners.set('blur', () => this.hide());
        break;
      default:
        throw Error(`${this.trigger} are not supported, default triggers have [hover | click | focus]`);
    }
    _manualListeners.forEach((listener, event) => {
      this._triggerDisposables.push(this._renderer.listen(element, event, listener));
    });
    _manualListeners.clear();
  }

  private _removeTriggerListeners() {
    this._triggerDisposables.forEach(dispose => {
      dispose();
    });
    this._triggerDisposables.length = 0;
  }
}
