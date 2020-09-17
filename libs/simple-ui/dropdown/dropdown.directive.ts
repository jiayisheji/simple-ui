import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import {
  HorizontalConnectionPos,
  OriginConnectionPosition,
  Overlay,
  OverlayConnectionPosition,
  OverlayRef,
  ScrollDispatcher,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { POSITION_MAP } from '@ngx-simple/core/overlay';
import { NgClassInterface, SafeAny } from '@ngx-simple/core/types';
import { BehaviorSubject, EMPTY, fromEvent, merge, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { SimDropdownComponent } from './dropdown.component';
import { DropdownPosition, triggerType } from './dropdown.typings';

@Directive({
  selector: '[simDropdown]',
  exportAs: 'simDropdownTrigger',
  host: {
    class: 'sim-dropdown-trigger',
    role: 'button'
  }
})
export class SimDropdownDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input()
  set simDropdown(value: SimDropdownComponent) {
    if (value instanceof SimDropdownComponent) {
      this._dropdownInstance = value;
    }
  }

  /** 允许用户定义dropdown相对于元素的位置 */
  @Input('simDropdownPosition')
  get position(): DropdownPosition {
    return this._position;
  }
  set position(value: DropdownPosition) {
    if (value !== this._position) {
      this._position = value;
      this._setDropdownComponentInput('_visibility', value.startsWith('top') ? 'top' : 'bottom');
    }
  }

  /** 禁用dropdown的显示 */
  @Input('simDropdownDisabled')
  @HostBinding('class.sim-dropdown-trigger-disabled')
  @InputBoolean<SimDropdownDirective, 'disabled'>()
  disabled: boolean;

  @Input('simDropdownTrigger') trigger: triggerType = 'click';

  @Input('simDropdownVisible')
  @InputBoolean<SimDropdownDirective, 'visible'>()
  @HostBinding('class.sim-dropdown-open')
  visible: boolean;

  /** 要传递给选择面板的类。支持"ngClass"相同的语法 */
  // tslint:disable-next-line: no-input-rename
  @Input('simDropdownPanelClass') panelClass: NgClassInterface;

  // tslint:disable-next-line: no-output-rename
  @Output('simDropdownVisibleChange') visibleChange: EventEmitter<boolean> = new EventEmitter();

  private _overlayRef: OverlayRef | null;
  private _dropdownInstance: SimDropdownComponent | null = null;
  private _position: DropdownPosition = 'bottom';
  private _portal: TemplatePortal<string>;

  /** 当组件被销毁时发出 */
  private readonly _destroyed$ = new Subject<void>();

  private _trigger$: BehaviorSubject<triggerType> = new BehaviorSubject<triggerType>(this.trigger);
  private _inputVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _overlayClose$ = new Subject<boolean>();

  constructor(
    private _overlay: Overlay,
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _scrollDispatcher: ScrollDispatcher
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { panelClass, trigger, disabled } = changes;
    if (trigger) {
      this._trigger$.next(this.trigger);
    }
    // 绑定弹出面板自定义样式
    if (panelClass) {
      this._setDropdownComponentInput('overlayClass', this.panelClass);
    }

    if (disabled) {
      this._inputVisible$.next(false);
    }
  }

  ngAfterViewInit(): void {
    // 如果没有关联直接抛出异常
    if (!this._dropdownInstance) {
      throw Error('A sim-dropdown need be associated with a [simDropdown].');
    }
    this._init();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  /** 切换显示隐藏 */
  toggle(visible: boolean): void {
    this._inputVisible$.next(visible);
  }

  /** 建立观察和订阅处理 */
  private _init() {
    const element: HTMLElement = this._elementRef.nativeElement;
    // 处理hover事件 包含弹出面板的hover事件
    const hostHover$ = merge(
      this._dropdownInstance.overlayVisible$,
      merge(fromEvent(element, 'mouseenter').pipe(mapTo(true)), fromEvent(element, 'mouseleave').pipe(mapTo(false)))
    );
    // 处理click事件
    const hostClick$ = merge(fromEvent(element, 'click').pipe(mapTo(true)));
    // 根据 trigger 处理对应的事件
    const visibleTrigger$ = this._trigger$.pipe(
      switchMap(trigger => {
        return (
          {
            hover: hostHover$,
            click: hostClick$
          }[trigger] || EMPTY
        );
      })
    );

    const hostVisible$ = merge(visibleTrigger$, this._dropdownInstance.dismissOverlay$, this._overlayClose$).pipe(
      filter(() => !this.disabled)
    );

    merge(this._inputVisible$, hostVisible$)
      .pipe(
        auditTime(150),
        distinctUntilChanged(),
        filter((visible: boolean) => {
          if (this.visible !== visible) {
            this.visibleChange.next(visible);
          }
          this.visible = visible;
          if (!visible) {
            if (this._overlayRef) {
              this._overlayRef.detach();
            }
            return false;
          }
          return true;
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe(() => {
        const overlayRef = this._createOverlay(element);
        if (!this._portal) {
          this._portal = this._portal || new TemplatePortal(this._dropdownInstance.templateRef, this._viewContainerRef);
        }
        overlayRef.attach(this._portal);
      });
  }

  /** 创建覆盖配置和位置策略 */
  private _createOverlay(element: HTMLElement): OverlayRef {
    if (this._overlayRef) {
      return this._overlayRef;
    }

    const { origin, overlay } = this._getOriginAndOverlayPosition();
    // 创建连接位置策略，侦听要重新定位的滚动事件。
    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPositions([
        { ...origin.main, ...overlay.main },
        { ...origin.fallback, ...overlay.fallback }
      ]);

    const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);

    strategy.withScrollableContainers(scrollableAncestors);

    strategy.positionChanges.pipe(takeUntil(this._destroyed$)).subscribe(change => {
      this._setDropdownComponentInput('_visibility', change.connectionPair.originY);
    });

    this._overlayRef = this._overlay.create({
      minWidth: element.getBoundingClientRect().width,
      hasBackdrop: this.trigger === 'click',
      backdropClass: '',
      disposeOnNavigation: true,
      positionStrategy: strategy,
      panelClass: 'sim-dropdown-panel',
      scrollStrategy: this._overlay.scrollStrategies.reposition()
    });

    merge(
      this._overlayRef.detachments(),
      this._overlayRef.backdropClick(),
      this._overlayRef
        .keydownEvents()
        // tslint:disable-next-line: deprecation
        .pipe(filter(e => e.keyCode === ESCAPE && !hasModifierKey(e)))
    )
      .pipe(mapTo(false), takeUntil(this._destroyed$))
      .subscribe(this._overlayClose$);

    return this._overlayRef;
  }

  private _getOriginAndOverlayPosition(): {
    origin: {
      main: OriginConnectionPosition;
      fallback: OriginConnectionPosition;
    };
    overlay: {
      main: OverlayConnectionPosition;
      fallback: OverlayConnectionPosition;
    };
  } {
    const position = POSITION_MAP[this.position];
    if (!position) {
      // 如果用户提供了无效的dropdown位置，则创建要引发的错误
      throw Error(`Dropdown position "${position}" is invalid.`);
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

  /** 反转叠加位置 */
  private _invertPosition(x: HorizontalConnectionPos, y: VerticalConnectionPos) {
    y = y === 'top' ? 'bottom' : 'top';
    return { x, y };
  }

  /** 为 sim-dropdown 设置属性并强制更新检查 */
  private _setDropdownComponentInput<V extends keyof SimDropdownComponent>(key: V, value: SimDropdownComponent[V]): void {
    if (this._dropdownInstance) {
      this._dropdownInstance.setInput(key, value);
      this._dropdownInstance._markForCheck();
    }
  }
}

@Directive({
  selector: '[simDropdownClose]',
  host: {
    class: 'sim-dropdown-close'
  }
})
export class SimDropdownCloseDirective {
  @Input('simDropdownClose')
  value: SafeAny;

  @Input()
  @InputBoolean<SimDropdownCloseDirective, 'disabled'>()
  disabled: boolean;

  @Output() readonly simDropdownClosedChange: EventEmitter<SafeAny> = new EventEmitter();

  constructor(private parentDropdown: SimDropdownComponent) {}

  @HostListener('click', ['$event'])
  _handleClick(event: Event): void {
    event.stopPropagation();
    if (this.parentDropdown && !this.disabled) {
      this.parentDropdown.dismiss();
      this.simDropdownClosedChange.next(this.value);
    }
  }
}
