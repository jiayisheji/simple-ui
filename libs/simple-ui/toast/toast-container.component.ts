import { AnimationEvent } from '@angular/animations';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
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
  NgZone,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { simToastAnimations } from './toast-animations';
import { SimToastConfig } from './toast-config';

@Component({
  selector: 'sim-toast-container',
  template: '<ng-template cdkPortalOutlet></ng-template>',
  styleUrls: ['./toast-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simToastAnimations.toastContainerState],
  host: {
    class: 'sim-toast-container'
  }
})
export class SimToastContainerComponent extends BasePortalOutlet implements OnDestroy {
  /** 此容器内的门户出口，toast把内容将加载到其中。 */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  /** toast动画的状态。 */
  @HostBinding('@state')
  _animationState = 'void';

  /** 标题为通知toast已退出视野。 */
  readonly _onExit: Subject<SafeAny> = new Subject();

  /** 标题为通知toast完成进入视图。 */
  readonly _onEnter: Subject<SafeAny> = new Subject();

  /** 组件是否已被销毁。 */
  private _destroyed = false;

  /** 当动画状态改变时发出 */
  _animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    public toastConfig: SimToastConfig,
    renderer: Renderer2
  ) {
    super();
    renderer.setAttribute(_elementRef.nativeElement, 'role', toastConfig.role);
  }

  ngOnDestroy(): void {
    this._destroyed = true;
    this._completeExit();
  }

  @HostListener('@state.done', ['$event'])
  onAnimationEnd(event: AnimationEvent) {
    const { fromState, toState } = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
      this._completeExit();
    }

    if (toState === 'visible') {
      // 注意：我们不应该在zone回调中使用`this`，因为它可能导致内存泄漏。
      const onEnter = this._onEnter;

      this._ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }

    this._animationStateChanged.emit(event);
  }

  /** 开始从视图进入的toast的动画 */
  enter(): void {
    if (!this._destroyed) {
      this._animationState = 'visible';
      this._changeDetectorRef.detectChanges();
    }
  }

  /** 开始从视图退出的toast的动画 */
  exit(): Observable<void> {
    // 注意：这一步转换为“hidden”，而不是“void”，为了处理在其中快速连续打开多个toast（例如，连续两次调用`SimToast.open`）
    this._animationState = 'hidden';

    // 使用“exit”属性标记该元素，以指示toast已被撤消，并将很快从DOM中删除。
    this._elementRef.nativeElement.setAttribute('sim-exit', '');

    return this._onExit;
  }

  /** 将组件门户作为内容附加到toast容器 */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    this._assertNotAttached();
    this._applyToastClasses();
    return this._portalOutlet.attachComponentPortal(portal);
  }

  /** 将模板门户作为内容附加到toast容器 */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    this._assertNotAttached();
    this._applyToastClasses();
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /**
   * 等待zone稳定后再移除元素。预防错误，我们最终删除了动画中间的元素。
   */
  private _completeExit() {
    this._ngZone.onMicrotaskEmpty
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this._onExit.next();
        this._onExit.complete();
      });
  }

  /** 将各种定位和用户配置的CSS类应用于toast */
  private _applyToastClasses() {
    const element: HTMLElement = this._elementRef.nativeElement;
    const panelClass = this.toastConfig.panelClass;

    if (panelClass) {
      if (Array.isArray(panelClass)) {
        // 注意，我们不能在这里使用扩展参数，因为IE不支持多个参数
        panelClass.forEach(cssClass => element.classList.add(cssClass));
      } else {
        element.classList.add(panelClass);
      }
    }
    // 设置水平class
    element.classList.add(`sim-toast-vertical-${this.toastConfig.verticalPosition}`);
    // 设置垂直class
    element.classList.add(`sim-toast-horizontal-${this.toastConfig.horizontalPosition}`);
  }

  /** 断言没有内容已附加到容器 */
  private _assertNotAttached() {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Attempting to attach snack bar content after content is already attached');
    }
  }
}
