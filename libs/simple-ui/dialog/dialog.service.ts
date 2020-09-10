import { ComponentType, Overlay, OverlayConfig, OverlayContainer, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  Inject,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  StaticProvider,
  TemplateRef
} from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { defer, Observable, Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { SimDialogConfig } from './dialog-config';
import { SimDialogRef } from './dialog-ref';
import { SimDialogComponent } from './dialog.component';

/** dialog 传递数据 */
export interface DialogResolve<T> {
  /** 传递数据 */
  resolve: T;
  /** 是否编辑模式 */
  editMode?: boolean;
  /** 标题 */
  heading?: string;
  /** 提交按钮名称 */
  buttonText?: string;
}

/** dialog 返回数据 */
export type DialogResult<T> = T;

/**
 * dialog 关闭回调结果
 * @param ignore 忽略undefined 如果用户不传递值将为`undefined`视为不处理值，如果需要处理可以设为`true`
 *
 * 我们可以有效忽略不传递值不需要执行`subscribe`方法的情况：
 * - 键盘Esc、空格键关闭
 * - 点击遮罩背景关闭
 * - [simDialogClose], [sim-dialog-close] 指令关闭不传递值
 * - 使用`SimDialogRef.close()`关闭不传递值
 */
export const toDialogResult = <T = SafeAny>(ignore?: boolean) => (source: Observable<T>): Observable<T> =>
  source.pipe(
    filter((value: DialogResult<T>): boolean => {
      return ignore || value !== undefined;
    })
  );

/** 注入令牌，可用于指定默认对话框选项 */
export const SIM_DIALOG_DEFAULT_OPTIONS = new InjectionToken<SimDialogConfig>('sim-dialog-default-options');

/** 注入令牌，可用于访问传递到对话框的数据 */
export const SIM_DIALOG_DATA = new InjectionToken<SafeAny>('SimDialogData');

/** 注入令牌，用于在对话框打开时确定滚动处理。 */
export const SIM_DIALOG_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('sim-dialog-scroll-strategy', {
  providedIn: 'root',
  factory: SIM_DIALOG_SCROLL_STRATEGY_FACTORY
});

export function SIM_DIALOG_SCROLL_STRATEGY_FACTORY(): () => ScrollStrategy {
  const overlay = inject(Overlay);
  return () => overlay.scrollStrategies.block();
}

export function SIM_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

export const SIM_DIALOG_SCROLL_STRATEGY_PROVIDER = {
  provide: SIM_DIALOG_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SIM_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY
};

@Injectable()
export class SimDialogService implements OnDestroy {
  /** 跟踪当前打开的对话框。 */
  get openDialogs(): Array<SimDialogRef<SafeAny>> {
    return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
  }

  /** 在打开对话框之后发出的流 */
  get afterOpened(): Subject<SimDialogRef<SafeAny>> {
    return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
  }

  get _afterAllClosed(): Subject<void> {
    const parent = this._parentDialog;
    return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
  }

  /**
   * 当所有打开的对话框完成关闭时发出的流。 如果没有打开的对话框，将在订阅时发出。
   */
  readonly afterAllClosed: Observable<void> = defer<void>(() =>
    // fix startWith Deprecation warning
    this.openDialogs.length ? this._afterAllClosed : this._afterAllClosed.pipe(startWith(undefined as void))
  );

  private _openDialogsAtThisLevel: Array<SimDialogRef<SafeAny>> = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<SimDialogRef<SafeAny>>();
  private _ariaHiddenElements = new Map<Element, string | null>();
  private _scrollStrategy: () => ScrollStrategy;

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    @Optional() @Inject(SIM_DIALOG_DEFAULT_OPTIONS) private _defaultOptions: SimDialogConfig,
    @Inject(SIM_DIALOG_SCROLL_STRATEGY) scrollStrategy: SafeAny,
    @Optional() @SkipSelf() private _parentDialog: SimDialogService,
    private _overlayContainer: OverlayContainer
  ) {
    this._scrollStrategy = scrollStrategy;
  }

  ngOnDestroy() {
    // 仅在销毁时关闭此级别的对话框 因为父服务可能仍处于活动状态。
    this._closeDialogs(this._openDialogsAtThisLevel);
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
  }

  /**
   * 打开一个包含给定组件的模式对话框。
   * @param componentOrTemplateRef 要加载到对话框中的组件的类型，或作为对话框内容实例化的TemplateRef。
   * @param config 额外的配置选项。
   * @returns 新打开的对话框。
   */
  open<T, D = SafeAny, R = SafeAny>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: SimDialogConfig<D>
  ): SimDialogRef<T, R> {
    const defaultOptions = this._defaultOptions || new SimDialogConfig();
    config = { ...defaultOptions, ...config };

    if (config.id && this.getDialogById(config.id)) {
      throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
    }

    const overlayRef = this._createOverlay(config);
    const dialogContainer = this._attachDialogContainer(overlayRef, config);
    const dialogRef = this._attachDialogContent<T, R>(componentOrTemplateRef, dialogContainer, overlayRef, config);

    // 如果这是我们打开的第一个对话框，隐藏所有非覆盖内容。
    if (!this.openDialogs.length) {
      this._hideNonDialogContentFromAssistiveTechnology();
    }
    this.openDialogs.push(dialogRef);
    dialogRef.afterClosed().subscribe(() => this._removeOpenDialog(dialogRef));
    this.afterOpened.next(dialogRef);
    return dialogRef;
  }

  /**
   * 通过它的id找到一个打开的对话框
   * @param id 查找对话框时使用的ID
   */
  getDialogById(id: string): SimDialogRef<SafeAny> | undefined {
    return this.openDialogs.find(dialog => dialog.id === id);
  }

  /**
   * 关闭所有当前打开的对话框
   */
  closeAll(): void {
    this._closeDialogs(this.openDialogs);
  }

  /**
   * 将创建的对话框加载到的浮层
   * @param config 对话框配置
   * @returns 解析为所创建浮层的OverlayRef的Promise
   */
  private _createOverlay(config: SimDialogConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  /**
   * 从对话框配置创建浮层配置
   * @param dialogConfig 对话框配置
   * @returns 浮层配置
   */
  private _getOverlayConfig(dialogConfig: SimDialogConfig): OverlayConfig {
    const state = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      scrollStrategy: dialogConfig.scrollStrategy || this._scrollStrategy(),
      panelClass: dialogConfig.panelClass,
      hasBackdrop: dialogConfig.hasBackdrop,
      minWidth: dialogConfig.minWidth,
      minHeight: dialogConfig.minHeight,
      maxWidth: dialogConfig.maxWidth,
      maxHeight: dialogConfig.maxHeight,
      disposeOnNavigation: dialogConfig.closeOnNavigation
    });

    if (dialogConfig.backdropClass) {
      state.backdropClass = dialogConfig.backdropClass;
    }

    return state;
  }

  /**
   * 将SimDialogComponent附加到对话框的已创建浮层上
   * @param overlay 引用对话框的底层浮层
   * @param config 对话框配置
   * @returns 解析为附加容器的ComponentRef的Promise
   */
  private _attachDialogContainer(overlay: OverlayRef, config: SimDialogConfig): SimDialogComponent {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{ provide: SimDialogConfig, useValue: config }]
    });

    const containerPortal = new ComponentPortal(SimDialogComponent, config.viewContainerRef, injector, config.componentFactoryResolver);
    const containerRef = overlay.attach<SimDialogComponent>(containerPortal);

    return containerRef.instance;
  }

  /**
   * 将用户提供的组件附加到已创建的SimDialogComponent
   * @param componentOrTemplateRef componentOrTemplateRef将组件加载到对话框中的类型，或将TemplateRef实例化为内容
   * @param dialogContainer 引用包装的SimDialogComponent
   * @param overlayRef 引用对话框所在的浮层
   * @param config 对话框配置
   * @returns 解析为SimDialogRef的promise应返回给用户。
   */
  private _attachDialogContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    dialogContainer: SimDialogComponent,
    overlayRef: OverlayRef,
    config: SimDialogConfig
  ): SimDialogRef<T, R> {
    // 创建对我们正在创建的对话框的引用，以便为用户提供一个控制修改并关闭它。
    const dialogRef = new SimDialogRef<T, R>(overlayRef, dialogContainer, config.id);

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null, { $implicit: config.data, dialogRef } as SafeAny)
      );
    } else {
      const injector = this._createInjector<T>(config, dialogRef, dialogContainer);
      const contentRef = dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector)
      );
      dialogRef.componentInstance = contentRef.instance;
    }

    dialogRef.updateSize(config.width, config.height).updatePosition(config.position);

    return dialogRef;
  }

  /**
   * 创建一个自定义注入器以在对话框中使用。 这允许将组件加载到内部对话框的，以关闭自身并返回一个值（可选）。
   * @param config 用于构造对话框的配置对象
   * @param dialogRef 引用对话框
   * @param container 包装所有内容的对话框容器元素
   * @returns 可以在对话框中使用的自定义注入器
   */
  private _createInjector<T>(config: SimDialogConfig, dialogRef: SimDialogRef<T>, dialogContainer: SimDialogComponent): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    // SimDialogComponent是在门户中注入的，因为SimDialogComponent和对话框的内容是在同一个ViewContainerRef中创建的
    // 因此，它们是注入器的兄弟目的。
    // 为了允许预期的层次结构，SimDialogComponent是显式的添加到注入令牌。
    const providers: StaticProvider[] = [
      { provide: SimDialogComponent, useValue: SimDialogComponent },
      { provide: SIM_DIALOG_DATA, useValue: config.data },
      { provide: SimDialogRef, useValue: dialogRef }
    ];

    return Injector.create({ parent: userInjector || this._injector, providers });
  }

  /**
   * 从打开的对话框数组中删除一个对话框
   * @param dialogRef 对话框被删除
   */
  private _removeOpenDialog(dialogRef: SimDialogRef<SafeAny>) {
    const index = this.openDialogs.indexOf(dialogRef);

    if (index > -1) {
      this.openDialogs.splice(index, 1);

      // 如果所有对话框均已关闭，请删除/恢复“ aria-hidden”传递给同级，并发送到`afterAllClosed`流。
      if (!this.openDialogs.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute('aria-hidden', previousValue);
          } else {
            element.removeAttribute('aria-hidden');
          }
        });

        this._ariaHiddenElements.clear();
        this._afterAllClosed.next();
      }
    }
  }

  /**
   * 隐藏所有的内容，而不是一个浮层从无障碍性技术
   */
  private _hideNonDialogContentFromAssistiveTechnology() {
    const overlayContainer = this._overlayContainer.getContainerElement();

    // 确保浮层容器被附加到DOM。
    if (overlayContainer.parentElement) {
      const siblings = overlayContainer.parentElement.children;

      for (let i = siblings.length - 1; i > -1; i--) {
        const sibling = siblings[i];

        if (
          sibling !== overlayContainer &&
          sibling.nodeName !== 'SCRIPT' &&
          sibling.nodeName !== 'STYLE' &&
          !sibling.hasAttribute('aria-live')
        ) {
          this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
          sibling.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  /** 关闭数组中的所有对话框 */
  private _closeDialogs(dialogs: Array<SimDialogRef<SafeAny>>) {
    let i = dialogs.length;

    while (i--) {
      // `_openDialogs`属性在关闭后才更新，直到rxjs订阅在下一个微任务上运行, 除了要修改数组之外
      // 我们遍历所有这些并调用close而不假设它们会立即从列表中删除。
      dialogs[i].close();
    }
  }
}
