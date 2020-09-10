import { AnimationEvent } from '@angular/animations';
import { ConfigurableFocusTrapFactory, FocusMonitor, FocusOrigin, FocusTrap } from '@angular/cdk/a11y';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { simDialogAnimations } from './dialog-animations';
import { SimDialogConfig } from './dialog-config';

function throwSimDialogContentAlreadyAttachedError() {
  throw Error('Attempting to attach dialog content after content is already attached');
}

@Component({
  selector: 'sim-dialog',
  template: '<ng-template cdkPortalOutlet></ng-template>',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simDialogAnimations.slideDialog],
  host: {
    class: 'sim-dialog',
    '[role]': 'config.role',
    '[attr.tabindex]': '-1'
  }
})
export class SimDialogComponent extends BasePortalOutlet {
  /** 当动画状态改变时发出 */
  _animationStateChanged = new EventEmitter<AnimationEvent>();

  _closeInteractionType: FocusOrigin | null = null;

  /** 该容器内部的门户插槽，对话框内容将被加载到其中 */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  /** 对话动画的状态 */
  @HostBinding('@slideDialog')
  state: 'void' | 'enter' | 'exit' = 'enter';

  /** 容器DOM元素的ID */
  @HostBinding('attr.id')
  id: string;

  private _document: Document;
  /** 在Dialog中捕获和管理焦点的类 */
  private _focusTrap: FocusTrap;

  /** 在打开对话框之前聚焦的元素。 保存此元素方便在关闭时恢复 */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  constructor(
    private _elementRef: ElementRef,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) _document: SafeAny,
    public config: SimDialogConfig,
    private _focusMonitor?: FocusMonitor
  ) {
    super();
    this._document = _document;
  }

  /**
   * 将ComponentPortal作为内容附加到此对话框容器
   * @param portal 将门户附加为对话框内容
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throwSimDialogContentAlreadyAttachedError();
    }

    this._setupFocusTrap();
    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * 将TemplatePortal作为内容附加到此对话框容器
   * @param portal 将门户附加为对话框内容
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throwSimDialogContentAlreadyAttachedError();
    }

    this._setupFocusTrap();
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /** 如果焦点被移出对话框，则将焦点移回到对话框中 */
  _recaptureFocus() {
    if (!this._containsFocus()) {
      const focusWasTrapped = this._focusTrap.focusInitialElement();

      if (!focusWasTrapped) {
        this._elementRef.nativeElement.focus();
      }
    }
  }

  /** 每当宿主上动画开始时调用 */
  @HostListener('@slideDialog.start', ['$event'])
  onAnimationStart(event: AnimationEvent) {
    this._animationStateChanged.emit(event);
  }

  /** 每当宿主上动画完成时调用 */
  @HostListener('@slideDialog.done', ['$event'])
  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._trapFocus();
    } else if (event.toState === 'exit') {
      this._restoreFocus();
    }

    this._animationStateChanged.emit(event);
  }

  /** 启动对话框退出动画. */
  startExitAnimation(): void {
    this.state = 'exit';

    // 标记容器以进行检查，以便在视图容器正在使用OnPush更改检测
    this._changeDetectorRef.markForCheck();
  }

  /** 将焦点移动到焦点陷阱内 */
  private _trapFocus() {
    // 如果我们试图立即集中精力，那么对话框的内容将不会在必须先运行更改检测的情况下准备就绪。
    // 为了解决这个问题，我们只需等待microtask队列为空
    if (this.config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else if (!this._containsFocus()) {
      // 否则，请确保将焦点放在对话框容器上。可能会有所不同组件在打开的动画运行时试图移动焦点。
      // https://github.com/angular/components/issues/16215.
      // 请注意，我们只想这样做如果焦点不在对话框中，因为使用者可能关闭`autoFocus`以便自己移动焦点。
      this._elementRef.nativeElement.focus();
    }
  }

  /** 将焦点恢复到对话框打开之前已聚焦的元素上 */
  private _restoreFocus() {
    const previousElement = this._elementFocusedBeforeDialogWasOpened;

    // 我们需要额外的检查，因为IE可以在某些情况下将“activeElement”设置为null。
    if (this.config.restoreFocus && previousElement && typeof previousElement.focus === 'function') {
      const activeElement = this._document.activeElement;
      const element = this._elementRef.nativeElement;
      // 确保焦点仍在对话框内或主体上（通常是因为将其移动到非可聚焦元素（如遮罩背景）之前。
      // 在动画制作完成之前，使用者自己移动了它，在这种情况下，我们不应该做任何事情
      if (!activeElement || activeElement === this._document.body || activeElement === element || element.contains(activeElement)) {
        if (this._focusMonitor) {
          this._focusMonitor.focusVia(previousElement, this._closeInteractionType);
          this._closeInteractionType = null;
        } else {
          previousElement.focus();
        }
      }
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /**
   * 设置焦点动态并保存对对话框打开前焦点元素的引用
   */
  private _setupFocusTrap() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }

    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;

      // 请注意，在服务器上进行渲染时没有聚焦方法
      if (this._elementRef.nativeElement.focus) {
        // 立即将焦点移到对话框上，以防止用户意外同时打开多个对话框
        // 需要异步，因为元素可能无法立即聚焦
        Promise.resolve().then(() => this._elementRef.nativeElement.focus());
      }
    }
  }

  /** 返回焦点是否在对话框内 */
  private _containsFocus(): boolean {
    const element = this._elementRef.nativeElement;
    const activeElement = this._document.activeElement;
    return element === activeElement || element.contains(activeElement);
  }
}
