import { AnimationEvent } from '@angular/animations';
import { ConfigurableFocusTrapFactory, FocusMonitor, FocusOrigin, FocusTrap } from '@angular/cdk/a11y';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { BooleanInput, toBoolean } from '@ngx-simple/core/coercion';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mapTo, startWith, take, takeUntil } from 'rxjs/operators';
import { simDrawerAnimations } from './drawer-animations';

/**
 * 抽屉显示模式
 * - over 抽屉浮在主内容上方，并用一个背景遮住主内容
 * - push 抽屉把主内容挤出去，并用一个背景遮住主内容
 * - side 抽屉和主内容并排显示，并收缩主内容的宽度，给抽屉腾出空间
 * - stack 抽屉浮在主内容上方，并用一个背景遮住主内容，可以并列显示多个抽屉
 */
export type SimDrawerMode = 'over' | 'push' | 'side' | 'stack';

/**
 * 用于为抽屉提供抽屉容器，同时避免循环引用。
 */
export const SIM_DRAWER_CONTAINER = new InjectionToken('SIM_DRAWER_CONTAINER');

@Component({
  selector: 'sim-drawer-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sim-drawer-content',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SimDrawerContentComponent extends CdkScrollable implements AfterContentInit {
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SimDrawerContainerComponent)) public _container: SimDrawerContainerComponent,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(elementRef, scrollDispatcher, ngZone);
  }

  ngAfterContentInit() {
    this._container._contentMarginChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
}

@Component({
  selector: 'sim-drawer',
  exportAs: 'simDrawer',
  template: `
    <div class="sim-drawer-inner-container">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simDrawerAnimations.transformDrawer],
  host: {
    class: 'sim-drawer',
    // 必须防止浏览器基于值对齐文本
    '[attr.align]': 'null',
    '[class.sim-drawer-end]': 'position === "right" || position === "bottom"',
    '[class.sim-drawer-start]': 'position === "left" || position === "top"',
    '[class.sim-drawer-over]': 'mode === "over"',
    '[class.sim-drawer-push]': 'mode === "push"',
    '[class.sim-drawer-side]': 'mode === "side"',
    '[class.sim-drawer-stack]': 'mode === "stack"',
    '[class.sim-drawer-opened]': 'opened',
    '[class.sim-drawer-vertical]': 'mode === "over" && (position === "top" || position === "bottom")',
    tabIndex: '-1'
  }
})
export class SimDrawerComponent implements AfterContentInit, OnDestroy {
  /** 抽屉是否打开我们重载它是因为我们在事件开始或结束时触发了它。 */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    this.toggle(toBoolean(value));
  }
  private _opened: boolean = false;

  /** 抽屉是否可以关闭与escape键或点击背景 */
  @Input()
  @InputBoolean<SimDrawerComponent, 'disableClose'>()
  disableClose: boolean = false;

  /** 附在抽屉上的一面 */
  @Input()
  get position(): 'left' | 'right' | 'top' | 'bottom' {
    return this._position;
  }
  set position(value: 'left' | 'right' | 'top' | 'bottom') {
    // 确保我们有一个有效值
    value = ['left', 'right', 'top', 'bottom'].includes(value) ? value : 'right';
    if (value !== this._position) {
      this._position = value;
      this.positionChanged.emit();
    }
  }
  private _position: 'left' | 'right' | 'top' | 'bottom' = 'right';

  /**
   * 抽屉打开时是否自动对焦第一个可调焦的元素。
   * 当“mode”设置为“side”时默认为false，否则默认为“true”。
   * 如果显式启用，焦点将移到抽屉的“side”模式。
   */
  @Input()
  get autoFocus(): boolean {
    const value = this._autoFocus;
    return value == null ? this.mode !== 'side' : value;
  }
  set autoFocus(value: boolean) {
    this._autoFocus = toBoolean(value);
  }
  private _autoFocus: boolean | undefined;

  /** 抽屉打开的方式; 'over'、'stack'、'push'或'side'中的一个 */
  @Input()
  get mode(): SimDrawerMode {
    return this._mode;
  }
  set mode(value: SimDrawerMode) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }
  private _mode: SimDrawerMode = 'over';

  /** 当抽屉的位置改变时触发 */
  @Output() positionChanged: EventEmitter<void> = new EventEmitter<void>();

  /** 当抽屉开始动画时就发出事件 */
  _animationStarted = new Subject<AnimationEvent>();

  /** 当抽屉动画完成时就发出事件 */
  _animationEnd = new Subject<AnimationEvent>();

  /** 当抽屉打开状态更改时发出的事件 */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter(true);

  /** 当抽屉始关闭时发出的事件 */
  @Output() readonly beforeClosed = this._animationStarted.pipe(
    filter(e => e.fromState !== e.toState && ['void', 'stack'].includes(e.toState)),
    mapTo(undefined)
  );
  /** 当抽屉已关闭时发出的事件 */
  @Output() readonly afterClosed = this.openedChange.pipe(
    filter(o => !o),
    map(() => {})
  );
  /** 当抽屉开始打开时发出的事件 */
  @Output() readonly beforeOpened = this._animationStarted.pipe(
    filter(e => e.fromState !== e.toState && e.toState.indexOf('open') === 0),
    mapTo(undefined)
  );
  /** 当抽屉被打开时发出的事件 */
  @Output() readonly afterOpened = this.openedChange.pipe(
    filter(o => o),
    map(() => {})
  );

  /** 抽屉动画的当前状态 */
  @HostBinding('@transform')
  _animationState: 'open-instant' | 'open' | 'void' | 'stack' = 'void';

  /** 堆叠索引 */
  _stackIndex: number;

  /** 当组件被销毁时发射事件 */
  private readonly _destroyed = new Subject<void>();

  /**
   * 当抽屉模式改变时发出的事件。这让抽屉容器用来知道何时到何时模式改变，以便它可以适应内容的边距。
   */
  readonly _modeChanged = new Subject<void>();

  /** 焦点捕获 */
  private _focusTrap: FocusTrap;

  /** 抽屉是如何打开的(按键，鼠标点击等) */
  private _openedVia: FocusOrigin | null;

  /** 打开抽屉之前的焦点元素 */
  private _elementFocusedBeforeDrawerWasOpened: HTMLElement | null = null;

  /** 抽屉是否初始化。用于禁用初始动画。 */
  private _enableAnimations = false;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    private _focusMonitor: FocusMonitor,
    private _platform: Platform,
    private _ngZone: NgZone,
    @Optional() @Inject(DOCUMENT) private _doc: any,
    @Optional() @Inject(SIM_DRAWER_CONTAINER) public _container?: SimDrawerContainerComponent
  ) {
    this.openedChange.subscribe((opened: boolean) => {
      if (opened) {
        if (this._doc) {
          this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement as HTMLElement;
        }

        this._takeFocus();
      } else if (this._isFocusWithinDrawer()) {
        this._restoreFocus();
      }
    });

    /**
     * 侦听区域外的“按键关闭”事件，这样更改检测就不会在每次按下按键时运行。
     * 相反，我们重新进入区域只有当'ESC·'键被按下，我们没有关闭禁用。
     */
    this._ngZone.runOutsideAngular(() => {
      (fromEvent(this._elementRef.nativeElement, 'keydown') as Observable<KeyboardEvent>)
        .pipe(
          filter(event => {
            // tslint:disable-next-line: deprecation
            return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
          }),
          takeUntil(this._destroyed)
        )
        .subscribe(event =>
          this._ngZone.run(() => {
            this.close();
            event.stopPropagation();
            event.preventDefault();
          })
        );
    });

    // 我们需要一个带有distinctUntilChanged的主题，因为在某些浏览器上“done”事件会触发两次。
    // see https://github.com/angular/angular/issues/24084
    this._animationEnd
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe((event: AnimationEvent) => {
        const { fromState, toState } = event;

        if ((toState.indexOf('open') === 0 && fromState === 'void') || (toState === 'void' && fromState.indexOf('open') === 0)) {
          this.openedChange.emit(this._opened);
        }
      });
  }

  ngAfterContentInit() {
    if (this._platform.isBrowser) {
      this._enableAnimations = true;
    }
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    this._updateFocusTrapState();
  }

  ngOnDestroy() {
    if (this._focusTrap) {
      this._focusTrap.destroy();
    }

    this._animationStarted.complete();
    this._animationEnd.complete();
    this._modeChanged.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * 打开抽屉
   * @param openedVia 抽屉是通过按键、鼠标点击或编程打开的。用于抽屉关闭后的焦点管理。
   */
  open(openedVia?: FocusOrigin) {
    return this.toggle(true, openedVia);
  }

  /** 关闭抽屉 */
  close() {
    return this.toggle(false);
  }

  /**
   * 切换抽屉
   * @param isOpen 这个抽屉是否应该打开
   * @param openedVia 抽屉是通过按键、鼠标点击或编程打开的。用于抽屉关闭后的焦点管理。
   */
  toggle(isOpen: boolean = !this.opened, openedVia?: FocusOrigin) {
    // 如果焦点当前在抽屉内容内，而我们正在关闭抽屉，则将焦点恢复到最初聚焦的元素(当抽屉打开时)。
    return this._setOpen(isOpen, !isOpen && this._isFocusWithinDrawer(), openedVia);
  }

  _getZIndex(): number {
    const { nativeElement } = this._elementRef;
    return nativeElement ? +nativeElement.style.zIndex || 4 : 4;
  }

  _getWidth(): number {
    const { nativeElement } = this._elementRef;
    return nativeElement ? nativeElement.offsetWidth || 0 : 0;
  }

  /** 设置堆叠模式的样式 */
  _setStyle(style: string, value: any) {
    this.renderer.setStyle(this._elementRef.nativeElement, style, value);
  }

  /** 设置堆叠模式的class */
  _setClass(name: string, toggle: boolean) {
    if (toggle) {
      this.renderer.addClass(this._elementRef.nativeElement, name);
    } else {
      this.renderer.removeClass(this._elementRef.nativeElement, name);
    }
  }

  @HostListener('@transform.start', ['$event'])
  _animationStartListener(event: AnimationEvent) {
    this._animationStarted.next(event);
  }

  @HostListener('@transform.done', ['$event'])
  _animationDoneListener(event: AnimationEvent) {
    this._animationEnd.next(event);
  }

  /** 用单击了背景的上下文关闭抽屉 */
  _closeViaBackdropClick() {
    // 如果抽屉在单击背景时关闭，我们总是希望恢复焦点。
    // 我们不需要检查焦点当前是否在抽屉里，因为点击背景会导致活动元素的失去焦点。
    return this._setOpen(false, true);
  }

  /**
   * 切换抽屉的打开状态
   * @param isOpen 这个抽屉是打开还是关上
   * @param restoreFocus 关闭时是否应将焦点恢复
   * @param openedVia 可在打开抽屉时随意设置的焦点原点。当焦点在抽屉关闭时恢复时，将使用原点。
   */
  private _setOpen(isOpen: boolean, restoreFocus: boolean, openedVia: FocusOrigin = 'program'): Promise<'open' | 'close'> {
    this._opened = isOpen;
    if (isOpen) {
      this._animationState = this._enableAnimations ? 'open' : 'open-instant';
      this._openedVia = openedVia;
    } else {
      if (this._container) {
        this._container._onCloseStackDrawers(this);
      }
      if (this.mode === 'stack') {
        this._animationState = 'stack';
      } else {
        this._animationState = 'void';
      }

      if (restoreFocus) {
        this._restoreFocus();
      }
    }

    this._updateFocusTrapState();

    return new Promise<'open' | 'close'>(resolve => {
      this.openedChange.pipe(take(1)).subscribe(open => resolve(open ? 'open' : 'close'));
    });
  }

  /** 焦点当前是否在抽屉内 */
  private _isFocusWithinDrawer(): boolean {
    const activeEl = this._doc?.activeElement;
    return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
  }

  /**
   * 把焦点移到抽屉里。注意，即使在`side`模式下禁用了焦点捕获，这也能工作。
   */
  private _takeFocus() {
    if (!this.autoFocus || !this._focusTrap) {
      return;
    }

    this._focusTrap.focusInitialElementWhenReady().then(hasMovedFocus => {
      // 如果没有可用聚焦元素，则对抽屉本身聚焦，这样键盘导航仍然有效。
      if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === 'function') {
        this._elementRef.nativeElement.focus();
      }
    });
  }

  /**
   * 将焦点恢复到抽屉打开时最初焦点所在的元素
   * 如果当时没有焦点元素，焦点将被恢复到抽屉。
   */
  private _restoreFocus() {
    if (!this.autoFocus) {
      return;
    }

    // 注意，我们没有通过'instanceof HTMLElement'来检查，这样我们也可以涵盖svg元素
    if (this._elementFocusedBeforeDrawerWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, this._openedVia);
    } else {
      this._elementRef.nativeElement.blur();
    }

    this._elementFocusedBeforeDrawerWasOpened = null;
    this._openedVia = null;
  }

  /** 更新焦点捕获的启用状态 */
  private _updateFocusTrapState() {
    if (this._focusTrap) {
      // 只有当抽屉以除侧面以外的任何模式打开时，焦点捕获才会启用
      this._focusTrap.enabled = this.opened && this.mode !== 'side';
    }
  }
}

@Component({
  selector: 'sim-drawer-container',
  exportAs: 'simDrawerContainer',
  templateUrl: './drawer-container.component.html',
  styleUrls: ['./drawer.component.scss'],
  host: {
    class: 'sim-drawer-container',
    '[class.sim-drawer-container-explicit-backdrop]': '_backdropOverride'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SIM_DRAWER_CONTAINER,
      useExisting: SimDrawerContainerComponent
    }
  ]
})
export class SimDrawerContainerComponent implements AfterContentInit, DoCheck, OnDestroy {
  static ngAcceptInputType_hasBackdrop: BooleanInput;

  @Input()
  get autosize(): boolean {
    return this._autosize;
  }
  set autosize(value: boolean) {
    this._autosize = toBoolean(value);
  }
  private _autosize: boolean;

  /** 是否有遮罩背景覆盖 */
  @Input()
  get hasBackdrop(): boolean {
    return this._hasBackdrop;
  }
  set hasBackdrop(value: boolean) {
    this._hasBackdrop = toBoolean(value);
  }
  _hasBackdrop: boolean | null;

  /** 单击抽屉背景时触发的事件 */
  @Output() readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  /** 所有抽屉都在容器里。包括抽屉内的嵌套容器。 */
  @ContentChildren(SimDrawerComponent, {
    // 我们需要使用`descendants: true`，因为如果将其保留为false, Ivy将不再匹配间接的descendants。
    descendants: false
  })
  _allDrawers: QueryList<SimDrawerComponent>;

  /** 属于此容器的抽屉 */
  _drawers = new QueryList<SimDrawerComponent>();

  /** 属于此容器的内容 */
  @ContentChild(SimDrawerContentComponent) _content: SimDrawerContentComponent;

  /**
   * 应用于内容的页边距。这些是用来推/收缩抽屉内容时，一个抽屉是开着的。
   * 即使对于push模式，我们也使用边界而不是变换，因为变换会破坏被变换元素内部的固定位置。
   */
  _contentMargins: { left: number | null; right: number | null } = { left: null, right: null };

  readonly _contentMarginChanges = new Subject<{ left: number | null; right: number | null }>();

  /** 具有“开始”位置的抽屉子元素 */
  get start(): SimDrawerComponent | null {
    return this._start;
  }

  /** 具有“结束”位置的抽屉子元素 */
  get end(): SimDrawerComponent | null {
    return this._end;
  }

  /** 对包装可滚动内容的CdkScrollable实例的引用。 */
  get scrollable(): CdkScrollable {
    return this._content;
  }

  /** 抽屉在开始/结束的位置，独立于方向 */
  private _start: SimDrawerComponent | null;
  private _end: SimDrawerComponent | null;

  /**
   * 左边/右边的抽屉 当方向改变时，这些也会改变。
   * 它们被用作上面的别名来正确地设置左/右样式。
   */
  private _left: SimDrawerComponent | null;
  private _right: SimDrawerComponent | null;

  /**
   * 保存堆叠的抽屉集合
   */
  private _stackDrawers: SimDrawerComponent[];

  /** 保存初始堆叠抽屉的层级 */
  private _stackStartDrawerZIndex: number;

  /** 当组件被销毁时发射事件 */
  private readonly _destroyed = new Subject<void>();

  /** 在每个ngDoCheck上发出。用于防抖回流 */
  private readonly _doCheckSubject = new Subject<void>();

  constructor(
    private _element: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {
    // 由于抽屉的最小宽度取决于视口宽度，如果视口改变，我们需要重新计算边缘。
    viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.updateContentMargins());
  }

  ngAfterContentInit() {
    this._allDrawers.changes
      .pipe(startWith(this._allDrawers), takeUntil(this._destroyed))
      .subscribe((drawer: QueryList<SimDrawerComponent>) => {
        this._drawers.reset(drawer.filter(item => !item._container || item._container === this));
        this._drawers.notifyOnChanges();
      });

    this._drawers.changes.pipe(startWith(null as unknown)).subscribe(() => {
      this._validateDrawers();

      this._drawers.forEach((drawer: SimDrawerComponent) => {
        this._watchDrawerToggle(drawer);
        this._watchDrawerPosition(drawer);
        this._watchDrawerMode(drawer);
      });

      if (!this._drawers.length || this._isDrawerOpen(this._start) || this._isDrawerOpen(this._end)) {
        this.updateContentMargins();
      }

      this._changeDetectorRef.markForCheck();
    });

    // 避免通过失效超时触及NgZone
    this._ngZone.runOutsideAngular(() => {
      this._doCheckSubject
        .pipe(
          debounceTime(10), // 任意中断时间，小于60fps的一帧
          takeUntil(this._destroyed)
        )
        .subscribe(() => this.updateContentMargins());
    });
  }

  ngDoCheck() {
    // 如果用户选择自动调整大小，请在每次变更检测周期中进行检查。
    if (this._autosize && this._isPushed()) {
      // 在NgZone之外运行，否则分解器会把我们扔进一个无限循环
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
    }
  }

  ngOnDestroy() {
    this._drawers.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * 重新计算和更新内容的内联样式。注意，这应该谨慎使用，因为它会导致回流。
   */
  updateContentMargins() {
    // 1. 对于“over”和“stack”模式的抽屉，它们不会影响内容。
    // 2. 对于“side”模式的抽屉，它们应该缩小内容。我们通过增加左边距(左边抽屉)或右边距(右边抽屉)来做到这一点。
    // 3. 对于“push”模式下的抽屉，应该在不调整大小的情况下改变内容。我们通过在左边或右边加边距，同时从另一边减去同样数量的边距来做到这一点。
    let left = 0;
    let right = 0;

    if (this._left && this._left.opened) {
      if (this._left.mode === 'side') {
        left += this._left._getWidth();
      } else if (this._left.mode === 'push') {
        const width = this._left._getWidth();
        left += width;
        right -= width;
      }
    }

    if (this._right && this._right.opened) {
      if (this._right.mode === 'side') {
        right += this._right._getWidth();
      } else if (this._right.mode === 'push') {
        const width = this._right._getWidth();
        right += width;
        left -= width;
      }
    }

    // 如果“right”或“left”为0，不要为元素设置样式。
    // 这允许用户在SSR场景中通过CSS类指定一个自定义的大小，其中测量的宽度将始终为零。
    // 注意，我们在这里重置为'null'，而不是下面，以确保下面的'if'中的类型是一致的。
    left = left || null;
    right = right || null;

    if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
      this._contentMargins = { left, right };

      // 回到NgZone，因为在某些情况下我们可能在外面。
      // 我们需要注意的是，只有在某些事情发生变化时才去做，否则我们可能会太频繁地进入状态。
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }

  /** 关闭堆叠模式的当前抽屉的后面兄弟 */
  _onCloseStackDrawers(drawer: SimDrawerComponent) {
    if (drawer.mode === 'stack' && this._stackDrawers && this._stackDrawers.length > 1) {
      const element = this._stackDrawers[drawer._stackIndex + 1];
      if (element) {
        element.close();
      }
    }
  }

  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalDrawersViaBackdrop();
  }

  _isShowingBackdrop(): boolean {
    return (
      (this._isDrawerOpen(this._start) && this._canHaveBackdrop(this._start)) ||
      (this._isDrawerOpen(this._end) && this._canHaveBackdrop(this._end))
    );
  }

  _closeModalDrawersViaBackdrop() {
    // 优先处理堆叠模式
    if (this._stackDrawers) {
      this._stackDrawers.reduceRight((acc, drawer) => {
        drawer._closeViaBackdropClick();
        return acc;
      }, null);
    }
    // 关闭所有打开抽屉，关闭不是禁用和模式不是“side”
    [this._start, this._end]
      .filter(drawer => drawer && !drawer.disableClose && this._canHaveBackdrop(drawer))
      .forEach(drawer => drawer._closeViaBackdropClick());
  }

  private _canHaveBackdrop(drawer: SimDrawerComponent): boolean {
    return drawer.mode !== 'side' || !!this._hasBackdrop;
  }

  /** 验证抽屉子组件的状态 */
  private _validateDrawers() {
    this._start = this._end = null;

    this._stackDrawers = [];

    // 确保我们最多有一个开始抽屉和一个结束抽屉
    this._drawers.forEach(drawer => {
      // 检查堆叠抽屉定位 只支持左右边
      if (drawer.mode === 'stack') {
        if (!['right', 'left'].includes(drawer.position)) {
          throw Error(`A drawer was declared for 'position="right"' or 'position="left"'`);
        }
      }
      if (drawer.position === 'right' || drawer.position === 'bottom') {
        if (drawer.mode === 'stack') {
          // 默认堆叠默认第一个为end
          if (this._start != null) {
            throw Error(`All stack drawer was declared for 'position="left"'`);
          }
          if (!this._end) {
            this._end = drawer;
            this._stackDrawers.push(drawer);
          } else {
            // 确保堆叠方向一致
            if (this._end.position === drawer.position) {
              this._stackDrawers.push(drawer);
            }
          }
        } else {
          if (this._end != null) {
            throw Error(`A drawer was already declared for 'position="right"'`);
          }
          this._end = drawer;
        }
      } else {
        if (drawer.mode === 'stack') {
          if (this._end != null) {
            throw Error(`All stack drawer was declared for 'position="right"'`);
          }
          if (!this._start) {
            this._start = drawer;
            this._stackDrawers.push(drawer);
          } else {
            // 确保堆叠方向一致
            if (this._start.position === drawer.position) {
              this._stackDrawers.push(drawer);
            }
          }
        } else {
          if (this._start != null) {
            throw Error(`A drawer was already declared for 'position="left"'`);
          }
          this._start = drawer;
        }
      }
    });

    // 处理堆叠计算 初始位置、索引和显示层级
    if (this._stackDrawers && this._stackDrawers.length > 1) {
      const start = this._end || this._start;
      const position = start.position;
      if (this._stackStartDrawerZIndex == null) {
        this._stackStartDrawerZIndex = start._getZIndex();
      }
      const zIndex = this._stackDrawers.length + this._stackStartDrawerZIndex;
      this._stackDrawers.reduce((acc, drawer, i) => {
        if (acc > 0) {
          drawer._setStyle(`margin-${position}`, `${acc}px`);
        }
        drawer._stackIndex = i;
        drawer._setStyle(`z-index`, zIndex - i);
        return acc + drawer._getWidth();
      }, 0);
    }

    this._right = this._left = null;

    this._left = this._start;
    this._right = this._end;
  }

  /**
   * 订阅抽屉positionChanged事件，以便在位置更改时重新验证抽屉。
   */
  private _watchDrawerPosition(drawer: SimDrawerComponent): void {
    if (!drawer) {
      return;
    }
    // 注意:在验证之前，我们需要等待微任务队列为空，因为两个抽屉可能同时交换位置。
    drawer.positionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
        this._validateDrawers();
      });
    });
  }

  /** 订阅抽屉模式的变化，以便我们可以运行变化检测 */
  private _watchDrawerMode(drawer: SimDrawerComponent): void {
    if (drawer) {
      drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed))).subscribe(() => {
        this.updateContentMargins();
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  /**
   * 订阅抽屉事件，以便在抽屉打开且背景可见时在主容器元素上设置类。这确保容器元素上的任何溢出都被正确隐藏。
   */
  private _watchDrawerToggle(drawer: SimDrawerComponent): void {
    drawer._animationStarted
      .pipe(
        filter((event: AnimationEvent) => event.fromState !== event.toState),
        takeUntil(this._drawers.changes)
      )
      .subscribe((event: AnimationEvent) => {
        // 在容器上设置过渡类，以便动画出现。一开始不应该设置这个，因为动画只应该通过状态的改变来触发。
        if (event.toState !== 'open-instant' && this._animationMode !== 'NoopAnimations') {
          this._element.nativeElement.classList.add('sim-drawer-transition');
        }

        this.updateContentMargins();
        this._changeDetectorRef.markForCheck();
      });

    if (drawer.mode !== 'side') {
      drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe(() => this._setContainerClass(drawer.opened));
    }
  }

  /** 在主“sim-draw-container”元素上切换“sim-draw-open”类。 */
  private _setContainerClass(isAdd: boolean): void {
    const classList = this._element.nativeElement.classList;
    const className = 'sim-drawer-container-has-open';

    if (isAdd) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }

  /** 容器是否被一个抽屉推到一边 */
  private _isPushed() {
    return (this._isDrawerOpen(this._start) && this._start.mode !== 'over') || (this._isDrawerOpen(this._end) && this._end.mode !== 'over');
  }

  private _isDrawerOpen(drawer: SimDrawerComponent | null): drawer is SimDrawerComponent {
    return drawer != null && drawer.opened;
  }
}
