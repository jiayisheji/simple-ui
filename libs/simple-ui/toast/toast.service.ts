import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  TemplateRef,
  Type
} from '@angular/core';
import { NgStringOrTemplateRef, SafeAny } from '@ngx-simple/core/types';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SimToastConfig, SIM_TOAST_DATA } from './toast-config';
import { SimToastContainerComponent } from './toast-container.component';
import { SimToastRef } from './toast-ref';
import { SimToastComponent } from './toast.component';
import { SimToastModule } from './toast.module';
import { ToastType } from './toast.typings';

export const SIM_TOAST_DEFAULT_OPTIONS = new InjectionToken<SimToastConfig>('sim-toast-default-options', {
  providedIn: 'root',
  factory: SIM_TOAST_DEFAULT_OPTIONS_FACTORY
});

export function SIM_TOAST_DEFAULT_OPTIONS_FACTORY(): SimToastConfig {
  return new SimToastConfig();
}

export const SIM_TOAST_DEFAULT_ICON_OPTIONS = new InjectionToken<SimToastConfig>('SIM_TOAST_DEFAULT_ICON_OPTIONS', {
  providedIn: 'root',
  factory: SIM_TOAST_DEFAULT_OPTIONS_FACTORY
});

/**
 * Confirm关闭回调结果
 * 自动提示回调里面的confirm字符串，如果只是处理成功，那么可以直接在pipe里面直接使用，如果需要处理其他方式，自行处理
 */
export const toToastConfirm = () => (source: Observable<string>) =>
  source.pipe(
    filter((value: string): boolean => {
      return value === 'confirm';
    })
  );

@Injectable({ providedIn: SimToastModule })
export class SimToastService implements OnDestroy {
  /** 以*any*级别引用当前打开的toast */
  get _openedToastRef(): SimToastRef<SafeAny> | null {
    const parent = this._parentToast;
    return parent ? parent._openedToastRef : this._SimToastRefAtThisLevel;
  }

  set _openedToastRef(value: SimToastRef<SafeAny> | null) {
    if (this._parentToast) {
      this._parentToast._openedToastRef = value;
    } else {
      this._SimToastRefAtThisLevel = value;
    }
  }
  /**
   * 在这个级别的视图中(在Angular注入器树中)引用当前的toast。
   * 如果有一个父类的ToastService服务，所有的操作都应该通过'_openedToastRef'委托给父类。
   */
  private _SimToastRefAtThisLevel: SimToastRef<SafeAny> | null = null;

  private _toastComponent: Type<SimToastComponent> = SimToastComponent;

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _breakpointObserver: BreakpointObserver,
    @Optional() @SkipSelf() private _parentToast: SimToastService,
    @Inject(SIM_TOAST_DEFAULT_OPTIONS) private _defaultConfig: SimToastConfig
  ) {}

  ngOnDestroy(): void {
    // 仅在销毁时关闭当前等级的toast
    if (this._SimToastRefAtThisLevel) {
      this._SimToastRefAtThisLevel.dismiss();
    }
  }

  /**
   * 合并配置到默认配置，生成新的配置
   */
  mergeConfig(config?: SimToastConfig): SimToastConfig {
    return { ...this._defaultConfig, ...config };
  }

  /**
   * 关闭当前可见的toast
   */
  dismiss(): void {
    if (this._openedToastRef) {
      this._openedToastRef.dismiss();
    }
  }

  /**
   * 自定义提示
   * @param content 提示内容 支持字符串和模板
   * @param options toast配置 默认类型warning，默认不关闭
   */
  open(content: NgStringOrTemplateRef, options?: SimToastConfig & { type?: ToastType }) {
    const { type, ...config } = options || {};

    return this._openToastComponent(content, type || 'warning', 0, config);
  }

  /**
   * 信息提示
   * @param content 提示内容 支持字符串和模板
   * @param config toast配置 默认延迟关闭2500ms
   */
  info(content: NgStringOrTemplateRef, config?: SimToastConfig) {
    return this._openToastComponent(content, 'info', 2500, config);
  }

  /**
   * 警告提示
   * @param content 提示内容 支持字符串和模板
   * @param config toast配置 默认延迟关闭2500ms
   */
  warning(content: NgStringOrTemplateRef, config?: SimToastConfig) {
    return this._openToastComponent(content, 'warning', 2500, config);
  }

  /**
   * 失败/危险提示
   * @param content 提示内容 支持字符串和模板
   * @param config toast配置 默认延迟关闭3000ms
   */
  danger(content: NgStringOrTemplateRef, config?: SimToastConfig) {
    return this._openToastComponent(content, 'danger', 3000, config);
  }

  /**
   * 成功提示
   * @param content 提示内容 支持字符串和模板
   * @param config toast配置 默认延迟关闭1800ms
   */
  success(content: NgStringOrTemplateRef, config?: SimToastConfig) {
    return this._openToastComponent(content, 'success', 1800, config);
  }

  /**
   * 空白提示 不会显示icon
   * @param content 提示内容 支持字符串和模板
   * @param config toast配置 默认延迟关闭2500ms
   */
  blank(content: NgStringOrTemplateRef, config?: SimToastConfig) {
    return this._openToastComponent(content, 'blank', 2500, config);
  }

  private _openToastComponent(content: NgStringOrTemplateRef, type: ToastType = 'warning', duration: number = 0, config?: SimToastConfig) {
    config = config || {};
    // 先设置默认
    config.duration = config.duration ?? duration;

    const _config = this.mergeConfig(config);

    _config.data = { content, type };

    _config.verticalPosition = 'top';

    return this.openFromComponent(this._toastComponent, _config);
  }

  /**
   * 创建并分发带有内容自定义组件的toast，删除当前打开的任何toast。
   *
   * @param component 要实例化的组件
   * @param config toast的额外配置
   */
  openFromComponent<T>(component: ComponentType<T>, config?: SimToastConfig): SimToastRef<T> {
    return this._attach(component, config) as SimToastRef<T>;
  }

  /**
   * 创建并分发带有内容自定义模板的toast，删除当前打开的任何toast。
   *
   * @param template 要实例化的模板
   * @param config toast的额外配置
   */
  openFromTemplate(template: TemplateRef<SafeAny>, config?: SimToastConfig): SimToastRef<EmbeddedViewRef<SafeAny>> {
    return this._attach(template, config);
  }

  /** 把旧的toast移出去，把新的toast加进来 */
  private _animateToast(toastRef: SimToastRef<SafeAny>, config: SimToastConfig) {
    // 当toast被关闭时，清除对它的引用
    toastRef.afterDismissed().subscribe(() => {
      // 如果旧的toast还没有被更新的toast取代，请清除toast引用。
      // tslint:disable-next-line: triple-equals
      if (this._openedToastRef == toastRef) {
        this._openedToastRef = null;
      }
    });

    if (this._openedToastRef) {
      // 如果已经有toast，请将其关闭，然后退出动画完成后，将创建新的toast。
      this._openedToastRef.afterDismissed().subscribe(() => {
        toastRef.containerInstance.enter();
      });
      this._openedToastRef.dismiss();
    } else {
      // 如果没有toast，请新的toast进入
      toastRef.containerInstance.enter();
    }

    // 如果提供了延迟关闭，请根据打开toast后的时间来设置关闭
    if (config.duration && config.duration > 0) {
      toastRef.afterOpened().subscribe(() => toastRef._dismissAfter(config.duration));
    }
  }

  /**
   * 放置新组件或模板作为toast容器的内容
   */
  private _attach<T>(content: ComponentType<T> | TemplateRef<T>, userConfig?: SimToastConfig): SimToastRef<T | EmbeddedViewRef<SafeAny>> {
    const config = {
      ...new SimToastConfig(),
      ...this._defaultConfig,
      ...userConfig
    };
    const overlayRef = this._createOverlay(config);
    const container = this._attachToastContainer(overlayRef, config);
    const toastRef = new SimToastRef<T | EmbeddedViewRef<SafeAny>>(container, overlayRef);

    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null, {
        $implicit: config.data,
        toastRef
      } as SafeAny);

      toastRef.instance = container.attachTemplatePortal(portal);
    } else {
      const injector = this._createInjector(config, toastRef);
      const portal = new ComponentPortal(content, undefined, injector);
      const contentRef = container.attachComponentPortal<T>(portal);

      // 我们不能通过注入器传递它，因为注入器是较早创建的。
      toastRef.instance = contentRef.instance;
    }

    // 订阅断点观察者并附加适当的sim-toast-handset。
    // 这个class应用于overlay元素，因为overlay必须展开以填充屏幕的宽度，这样才能得到全宽的toast。
    this._breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe(state => {
        const classList = overlayRef.overlayElement.classList;
        const className = 'sim-toast-handset';
        state.matches ? classList.add(className) : classList.remove(className);
      });

    this._animateToast(toastRef, config);
    this._openedToastRef = toastRef;
    return this._openedToastRef;
  }

  /** 将toast容器组件附加到浮层 */
  private _attachToastContainer(overlayRef: OverlayRef, config: SimToastConfig): SimToastContainerComponent {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = new PortalInjector(userInjector || this._injector, new WeakMap([[SimToastConfig, config]]));

    const containerPortal = new ComponentPortal(SimToastContainerComponent, config.viewContainerRef, injector);
    const containerRef: ComponentRef<SimToastContainerComponent> = overlayRef.attach(containerPortal);

    containerRef.instance.toastConfig = config;

    return containerRef.instance;
  }

  /**
   * 创建要在toast组件内部使用的注入器
   * @param config 用于创建toast的配置
   * @param toastRef 引用toast
   */
  private _createInjector<T>(config: SimToastConfig, toastRef: SimToastRef<T>): PortalInjector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    return new PortalInjector(
      userInjector || this._injector,
      new WeakMap<SafeAny, SafeAny>([
        [SimToastRef, toastRef],
        [SIM_TOAST_DATA, config.data]
      ])
    );
  }

  /**
   * 创建一个新的浮层，并把它放在正确的位置
   * @param config 用户指定的toast配置
   */
  private _createOverlay(config: SimToastConfig): OverlayRef {
    const overlayConfig = new OverlayConfig();

    const { hasBackdrop, horizontalPosition, verticalPosition } = config;

    const positionStrategy = this._overlay.position().global();

    overlayConfig.hasBackdrop = hasBackdrop;

    if (horizontalPosition === 'start') {
      positionStrategy.left('0');
    } else if (horizontalPosition === 'end') {
      positionStrategy.right('0');
    } else {
      positionStrategy.centerHorizontally();
    }

    if (verticalPosition === 'top') {
      positionStrategy.top('0');
    } else if (verticalPosition === 'bottom') {
      positionStrategy.bottom('0');
    } else {
      positionStrategy.centerVertically();
    }

    overlayConfig.positionStrategy = positionStrategy;
    return this._overlay.create(overlayConfig);
  }
}
