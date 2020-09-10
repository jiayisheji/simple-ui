import { isNumber } from '@ngx-simple/core/typeof';
import { clamp } from '@ngx-simple/core/utils';
import { BehaviorSubject, combineLatest, Observable, of, Subject, timer } from 'rxjs';
import { debounce, delay, distinctUntilChanged, filter, map, skip, switchMap, tap } from 'rxjs/operators';
import { SimNprogressDefaultOptions } from './nprogress-config';
import { NprogressState } from './nprogress.typings';

export class SimNprogressRef {
  get isStarted(): boolean {
    return this._state.active;
  }

  /** 进度条开始事件 */
  get started(): Observable<boolean> {
    return this.state$.pipe(
      map((state: NprogressState) => state.active),
      distinctUntilChanged(),
      filter((active: boolean) => active)
    );
  }

  /** 进度条结束事件 */
  get completed(): Observable<boolean> {
    return this.state$.pipe(
      map((state: NprogressState) => state.active),
      distinctUntilChanged(),
      filter((active: boolean) => !active),
      skip(1)
    );
  }

  /** 更改配置时发出的流 */
  config$ = new Subject<SimNprogressDefaultOptions>();
  state$ = new BehaviorSubject<NprogressState>(null);

  /** 当进度条状态更改时发出的流。 */
  private _state: NprogressState = { active: false, value: 0 };

  private _config: SimNprogressDefaultOptions;

  /** 增加和更新进度条状态的流。 */
  private _trickling$ = new Subject();

  constructor(customConfig: SimNprogressDefaultOptions) {
    combineLatest([this._trickling$, this.config$])
      .pipe(
        debounce(([start, config]: [boolean, SimNprogressDefaultOptions]) => timer(start ? config.debounceTime : 0)),
        switchMap(([start, config]: [boolean, SimNprogressDefaultOptions]) => (start ? this._trickling(config) : this._complete(config)))
      )
      .subscribe();

    this.setConfig(customConfig);
    this.state$.next(this._state);
  }

  start() {
    this._trickling$.next(true);
  }

  complete() {
    this._trickling$.next(false);
  }

  inc(amount?: number) {
    const n = this._state.value;
    if (!this.isStarted) {
      this.start();
    } else {
      if (!isNumber(amount)) {
        amount = this._config.trickleFunc(n);
      }
      this.set(n + amount);
    }
  }

  set(n: number) {
    this._setState({ value: this._clamp(n), active: true });
  }

  setConfig(config: SimNprogressDefaultOptions) {
    this._config = { ...this._config, ...config };
    this.config$.next(this._config);
  }

  /**
   * 用户应该使用`SimNprogressService.destroy(id)`而不是直接在内部使用
   */
  destroy() {
    this._trickling$.complete();
    this.state$.complete();
    this.config$.complete();
  }

  private _setState(state: NprogressState) {
    this._state = { ...this._state, ...state };
    this.state$.next(this._state);
  }

  /** 获取一个介于最小值和最大值之间的值 */
  private _clamp(n: number): number {
    return clamp(n, this._config.max, this._config.min);
  }

  /** 保持递增的进度 */
  private _trickling(config: SimNprogressDefaultOptions) {
    if (!this.isStarted) {
      this.set(this._config.min);
    }
    return timer(0, config.trickleSpeed).pipe(tap(() => this.inc()));
  }

  /** 完成 然后重置进度 */
  private _complete(config: SimNprogressDefaultOptions) {
    return !this.isStarted
      ? of({})
      : of({}).pipe(
          // 完成进度
          tap(() => this._setState({ value: 100 })),

          // 在延迟之后隐藏进度条
          delay(config.speed * 1.7),
          tap(() => this._setState({ active: false })),

          // 重置进度状态
          delay(config.speed),
          tap(() => this._setState({ value: 0 }))
        );
  }
}
