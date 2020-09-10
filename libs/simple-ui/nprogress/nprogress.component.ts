import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { mixinColor, MixinElementRefBase, mixinUnsubscribe, ThemePalette, untilUnmounted } from '@ngx-simple/core/common-behaviors';
import { InputBoolean, InputNumber } from '@ngx-simple/core/decorators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SimNprogressRef } from './nprogress-ref';
import { SimNprogressService } from './nprogress.service';
import { NprogressState } from './nprogress.typings';

const _NprogressMixinBase = mixinUnsubscribe(mixinColor(MixinElementRefBase));

@Component({
  selector: 'sim-nprogress',
  templateUrl: './nprogress.component.html',
  styleUrls: ['./nprogress.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-nprogress',
    role: 'progressbar'
  }
})
export class NprogressComponent extends _NprogressMixinBase implements OnChanges, OnInit, OnDestroy {
  /** 如果id不存在，则创建一个新实例 */
  @Input() id = 'root';
  /** 从全局配置初始化输入 */
  @Input() spinnerPosition: 'left' | 'right' = this._nprogress.config.spinnerPosition;

  @Input() ease: string = this._nprogress.config.ease;

  @Input() color: ThemePalette = this._nprogress.config.color;

  @Input()
  @InputBoolean<NprogressComponent, 'meteor'>()
  meteor: boolean = this._nprogress.config.meteor;

  @Input()
  @InputBoolean<NprogressComponent, 'spinner'>()
  spinner: boolean = this._nprogress.config.spinner;

  @Input()
  @HostBinding('class.sim-nprogress-thick')
  @InputBoolean<NprogressComponent, 'thick'>()
  thick: boolean = this._nprogress.config.thick;

  @Input()
  @InputNumber<NprogressComponent, 'max'>(100)
  max: number = this._nprogress.config.max;

  @Input()
  @InputNumber<NprogressComponent, 'min'>(8)
  min: number = this._nprogress.config.min;

  @Input()
  @InputNumber<NprogressComponent, 'speed'>(200)
  speed: number = this._nprogress.config.speed;

  @Input()
  @InputNumber<NprogressComponent, 'trickleSpeed'>(300)
  trickleSpeed: number = this._nprogress.config.trickleSpeed;

  @Input() trickleFunc: (n: number) => number = this._nprogress.config.trickleFunc;

  @Input()
  @InputNumber<NprogressComponent, 'debounceTime'>(0)
  debounceTime: number = this._nprogress.config.debounceTime;

  @Output() started = new EventEmitter();

  @Output() completed = new EventEmitter();

  /** 进度条引用 */
  nprogressRef: SimNprogressRef;

  /** 进度条状态流 */
  state$: Observable<{ active: boolean; transform: string }>;

  constructor(_elementRef: ElementRef, private _nprogress: SimNprogressService) {
    super(_elementRef);
  }

  ngOnChanges() {
    if (this.nprogressRef instanceof SimNprogressRef) {
      // 当 @input() 更改时更新进度条配置
      this.nprogressRef.setConfig({
        max: this.max > 0 && this.max <= 100 ? this.max : 100,
        min: this.min < 100 && this.min >= 0 ? this.min : 0,
        speed: this.speed,
        trickleSpeed: this.trickleSpeed,
        trickleFunc: this.trickleFunc,
        debounceTime: this.debounceTime
      });
    }
  }

  ngOnInit() {
    // 获取进度条服务实例
    this.nprogressRef = this._nprogress.ref(this.id, {
      max: this.max,
      min: this.min,
      speed: this.speed,
      trickleSpeed: this.trickleSpeed,
      debounceTime: this.debounceTime
    });
    this.state$ = this.nprogressRef.state$.pipe(
      map((state: NprogressState) => ({
        active: state.active,
        transform: `translate3d(${state.value - 100}%,0,0)`
      }))
    );
    /** 订阅用户使用时已启动和已完成的事件 */
    if (this.started.observers.length) {
      this.nprogressRef.started.pipe(untilUnmounted(this)).subscribe(() => this.started.emit());
    }
    if (this.completed.observers.length) {
      this.nprogressRef.completed.pipe(untilUnmounted(this)).subscribe(() => this.completed.emit());
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._nprogress.destroy(this.id);
  }

  start() {
    this.nprogressRef.start();
  }

  complete() {
    this.nprogressRef.complete();
  }

  inc(n?: number) {
    this.nprogressRef.inc(n);
  }

  set(n: number) {
    this.nprogressRef.set(n);
  }

  get isStarted() {
    return this.nprogressRef.isStarted;
  }
}
