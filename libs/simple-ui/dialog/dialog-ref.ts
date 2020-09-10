import { FocusOrigin } from '@angular/cdk/a11y';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { SafeAny } from '@ngx-simple/core/types';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DialogPosition } from './dialog-config';
import { SimDialogComponent } from './dialog.component';

// 用于唯一对话框id的计数器
let uniqueId = 0;

/** 对话框生命周期的状态 */
export const enum SimDialogState {
  OPEN,
  CLOSING,
  CLOSED
}

/**
 * 引用通过SimDialog服务打开的对话框
 */
export class SimDialogRef<T, R = SafeAny> {
  /** 在对话框中打开的组件实例 */
  componentInstance: T;

  /** 是否允许用户关闭对话框 */
  disableClose: boolean | undefined = this._containerInstance.config.disableClose;

  /** 通知用户对话框已完成打开的Subject */
  private readonly _afterOpened = new Subject<void>();

  /** 通知用户对话框关闭之后的Subject */
  private readonly _afterClosed = new Subject<R | undefined>();

  /** 通知用户对话框关闭之前的Subject */
  private readonly _beforeClosed = new Subject<R | undefined>();

  /** dialogResult 将传递给 afterClosed */
  private _result: R | undefined;

  /** 处理退出时正在运行的超时，以防退出动画不触发 */
  private _closeFallbackTimeout: number;

  /** 对话框的当前状态 */
  private _state = SimDialogState.OPEN;

  constructor(
    private _overlayRef: OverlayRef,
    public _containerInstance: SimDialogComponent,
    readonly id: string = `sim-dialog-${uniqueId++}`
  ) {
    // 将id传递给容器
    _containerInstance.id = id;
    // 当打开动画完成时发出
    _containerInstance._animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'done' && event.toState === 'enter'),
        take(1)
      )
      .subscribe(() => {
        this._afterOpened.next();
        this._afterOpened.complete();
      });
    // 关闭动画完成后处理浮层
    _containerInstance._animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'done' && event.toState === 'exit'),
        take(1)
      )
      .subscribe(() => {
        clearTimeout(this._closeFallbackTimeout);
        this._finishDialogClose();
      });

    _overlayRef.detachments().subscribe(() => {
      this._beforeClosed.next(this._result);
      this._beforeClosed.complete();
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
      this.componentInstance = null;
      this._overlayRef.dispose();
    });

    _overlayRef
      .keydownEvents()
      .pipe(
        filter(event => {
          return (
            // tslint:disable-next-line: deprecation
            event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)
          );
        })
      )
      .subscribe(event => {
        event.preventDefault();
        this.close();
      });

    _overlayRef.backdropClick().subscribe(() => {
      if (this.disableClose) {
        this._containerInstance._recaptureFocus();
      } else {
        this.close();
      }
    });
  }

  /**
   * 关闭对话框
   * @param dialogResult 返回对话框打开组件的可选结果.
   */
  close(dialogResult?: R): void {
    this._result = dialogResult;

    // 将遮罩背景与对话框平滑过渡
    this._containerInstance._animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'start'),
        take(1)
      )
      .subscribe(event => {
        this._beforeClosed.next(dialogResult);
        this._beforeClosed.complete();
        this._overlayRef.detachBackdrop();

        // 放置浮层的逻辑取决于退出动画的完成情况, 然而无法保证父视图在运行时是否被销毁。
        // 添加应变计划，如果没有在指定的时间内触发动画，超时将清除所有内容时间量加上100毫秒。
        // 我们不需要在NgZone之外运行它，因为对于绝大多数情况下，超时将在机会触发之前被清除。
        this._closeFallbackTimeout = (setTimeout(() => this._finishDialogClose(), event.totalTime + 100) as unknown) as number;
      });

    this._containerInstance.startExitAnimation();
    this._state = SimDialogState.CLOSING;
  }

  /**
   * 获取一个Observable，该对象在对话框完成打开时会得到通知
   */
  afterOpened(): Observable<void> {
    return this._afterOpened.asObservable();
  }

  /**
   * 获取一个Observable，该对象在对话框完成关闭之后时会得到通知。
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * 获取一个Observable，该对象在对话框完成关闭之前时会得到通知。
   */
  beforeClosed(): Observable<R | undefined> {
    return this._beforeClosed.asObservable();
  }

  /**
   * 获取一个Observable，该对象在点击遮罩背景时会得到通知
   */
  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
  }

  /**
   * 获取一个Observable，该对象在锁定浮层上的keydown事件时会得到通知
   */
  keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  /**
   * 更新对话框的位置
   * @param position 新对话框位置
   */
  updatePosition(position?: DialogPosition): this {
    const strategy = this._getPositionStrategy();

    if (position && (position.left || position.right)) {
      position.left ? strategy.left(position.left) : strategy.right(position.right);
    } else {
      strategy.centerHorizontally();
    }

    if (position && (position.top || position.bottom)) {
      position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
    } else {
      strategy.centerVertically();
    }

    this._overlayRef.updatePosition();

    return this;
  }

  /**
   * 更新对话框的宽度和高度
   * @param width 对话框的新宽度
   * @param height 对话框的新高度
   */
  updateSize(width: string = '', height: string = ''): this {
    // tslint:disable-next-line: deprecation
    this._getPositionStrategy().width(width).height(height);
    this._overlayRef.updatePosition();
    return this;
  }

  /** 获取对话框生命周期的当前状态 */
  getState(): SimDialogState {
    return this._state;
  }

  /**
   * 通过更新对话框的状态并处理浮层来完成对话框关闭
   */
  private _finishDialogClose() {
    this._state = SimDialogState.CLOSED;
    this._overlayRef.dispose();
  }

  /** 从overlayRef中获取位置策略对象 */
  private _getPositionStrategy(): GlobalPositionStrategy {
    return this._overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
  }
}

export function _closeDialogVia<R>(ref: SimDialogRef<R>, interactionType: FocusOrigin, result?: R) {
  if (ref._containerInstance !== undefined) {
    ref._containerInstance._closeInteractionType = interactionType;
  }
  return ref.close(result);
}
