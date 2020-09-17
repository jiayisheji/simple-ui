import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {
  CanColor,
  CanSize,
  mixinColor,
  MixinElementRefBase,
  mixinSize,
  mixinUnsubscribe,
  ThemePalette,
  ThemeSize,
  untilUnmounted
} from '@ngx-simple/core/common-behaviors';
import { InputBoolean, InputNumber } from '@ngx-simple/core/decorators';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, flatMap } from 'rxjs/operators';
import { SimSpinnerDefaultOptions, SIM_SPINNER_DEFAULT_OPTIONS } from './default-options';

const _SpinnerMixinBase = mixinUnsubscribe(mixinSize(mixinColor(MixinElementRefBase, 'primary'), 'medium'));

@Component({
  selector: 'sim-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-spinner',
    role: 'progressbar',
    '[class.sim-spinner-wrapper]': '!single'
  }
})
export class SimSpinnerComponent extends _SpinnerMixinBase implements OnChanges, OnInit, CanColor, CanSize {
  @Input() color: ThemePalette;

  @Input() size: ThemeSize;

  /** 是否加载状态 */
  @Input()
  @InputBoolean<SimSpinnerComponent, 'loading'>()
  loading: boolean = false;

  /** 独立容器，不包裹内容 */
  @Input()
  @HostBinding('class.sim-spinner-single')
  @InputBoolean<SimSpinnerComponent, 'single'>()
  single: boolean = false;

  /** 延迟显示加载效果的时间（防止闪烁），单位：毫秒 */
  @Input()
  @InputNumber<SimSpinnerComponent, 'delay'>()
  delay: number = 0;

  /** 当作为包裹元素时，可以自定义描述文案 */
  @Input() placeholder: string;

  /** 加载指示符 */
  @Input() indicator: SimSpinnerDefaultOptions;

  _isLoading: boolean;

  private spinning$ = new BehaviorSubject(this.loading);
  private delay$ = new BehaviorSubject(this.delay);

  constructor(
    _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(SIM_SPINNER_DEFAULT_OPTIONS) _options?: SimSpinnerDefaultOptions
  ) {
    super(_elementRef);
    if (_options) {
      this.indicator = _options;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { loading, delay } = changes;
    if (loading) {
      this.spinning$.next(this.loading);
    }
    if (delay) {
      this.delay$.next(this.delay);
    }
  }

  ngOnInit(): void {
    this.spinning$
      .pipe(
        flatMap(() => this.delay$),
        flatMap(delay => {
          if (delay === 0) {
            return this.spinning$;
          } else {
            return this.spinning$.pipe(debounceTime(delay));
          }
        }),
        untilUnmounted(this)
      )
      .subscribe((loading: boolean) => {
        this._isLoading = loading;
        this._changeDetectorRef.markForCheck();
      });
  }
}
