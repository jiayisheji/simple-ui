import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { SimToastContainerComponent } from './toast-container.component';

/** 取消toast时发出的事件 */
export interface SimToastDismiss {
  /** toast是否通过操作按钮关闭 */
  dismissedByAction: boolean;
}

/** 可以传入setTimeout的最大毫秒数 */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;

export class SimToastRef<T> {
  /** 组成Toast内容的组件实例 */
  instance: T;

  /** 组成Toast内容的组件实例 */
  containerInstance: SimToastContainerComponent;

  /** 通知用户toast已关闭的Subject */
  private readonly _afterDismissed = new Subject<SimToastDismiss>();

  /** 通知用户toast已经打开并出现的Subject */
  private readonly _afterOpened = new Subject<void>();

  /** 通知用户toast将要关闭的Subject */
  private readonly _beforeDismissed = new Subject<void>();

  /** 通知用户调用了toast操作的Subject */
  private readonly _onAction = new Subject<string>();

  /**
   * 持续时间setTimeout调用的超时ID。用于清除超时，如果在超时时间过去之前toast被取消。
   */
  private _durationTimeoutId: number;

  /** toast是否通过动作按钮关闭. */
  private _dismissedByAction = false;
  private _dismissedDuration = null;

  constructor(containerInstance: SimToastContainerComponent, private _overlayRef: OverlayRef) {
    this.containerInstance = containerInstance;
    // 订阅 关闭toast动作
    this.onAction().subscribe(() => this.dismiss());
    containerInstance._onExit.subscribe(() => this._finishDismiss());
  }

  /** 关闭toast */
  dismiss(): void {
    this._beforeDismissed.next();
    this._beforeDismissed.complete();
    setTimeout(() => {
      if (!this._afterDismissed.closed) {
        this.containerInstance.exit();
      }
      clearTimeout(this._durationTimeoutId);
    }, 100);
  }

  /** 标记toast动作已单击 */
  dismissWithAction(value?: string): void {
    if (!this._onAction.closed) {
      this._dismissedByAction = true;
      this._onAction.next(value);
      this._onAction.complete();
    }
  }

  /**
   * 指定延迟时间关闭toast
   * @param 延迟时间 毫秒
   */
  _dismissAfter(duration: number): void {
    if (this._dismissedDuration == null) {
      this._dismissedDuration = Date.now() + duration;
    }
    // 注意，我们需要将持续时间限制为setTimeout的最大值, 如果设置更大的值（例如，“Infinity”），它将自动转换为1。
    this._durationTimeoutId = (setTimeout(() => this.dismiss(), Math.min(duration, MAX_TIMEOUT)) as unknown) as number;
  }

  /**
   * 关闭终端
   */
  _dismissSuspend(): number {
    if (this._dismissedDuration == null) {
      return 0;
    }
    clearTimeout(this._durationTimeoutId);
    return this._dismissedDuration - Date.now();
  }

  /** 将toast标记为已打开 */
  _open(): void {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }

  /** 获取一个Observable，该事件在toast完成关闭之前得到通知。 */
  beforeDismissed(): Observable<void> {
    return this._beforeDismissed.asObservable();
  }

  /** 获取一个Observable，该事件在toast完成关闭时得到通知。 */
  afterDismissed(): Observable<SimToastDismiss> {
    return this._afterDismissed.asObservable();
  }

  /** 获取一个Observable，该事件在toast打开并出现时得到通知。 */
  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }

  /** 获取一个Observable，该事件在调用toast操作时得到通知 */
  onAction(): Observable<string> {
    return this._onAction.asObservable();
  }

  /** 关闭后清理DOM */
  private _finishDismiss(): void {
    this._overlayRef.dispose();

    if (!this._onAction.closed) {
      this._onAction.complete();
    }

    this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
    this._afterDismissed.complete();
    this._dismissedByAction = false;
  }
}
