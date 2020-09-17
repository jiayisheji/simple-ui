import { AnimationEvent } from '@angular/animations';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { TabBodyOriginState, TabBodyPositionState } from './tab.type';
import { simTabsAnimations } from './tabs.animations';

@Component({
  selector: 'sim-tab-body',
  templateUrl: './tab-body.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simTabsAnimations.translateTab]
})
export class SimTabBodyComponent implements OnInit, OnDestroy {
  /** 作为活动选项卡，标签开始朝向中心设置动画时发出的事件。 */
  @Output() readonly _onCentering: EventEmitter<number> = new EventEmitter<number>();
  /** 在选项卡居中之前发出的事件。 */
  @Output() readonly _beforeCentering: EventEmitter<boolean> = new EventEmitter<boolean>();
  /** 在选项卡居中之前发出的事件。 */
  @Output() readonly _afterLeavingCenter: EventEmitter<boolean> = new EventEmitter<boolean>();
  /** 当选项卡完成其向中心的动画时发出的事件。 */
  @Output() readonly _onCentered: EventEmitter<void> = new EventEmitter<void>(true);
  @Input() id: number;
  /** 要显示的标签正文内容 */
  @Input() content: TemplatePortal<SafeAny>;

  /** 当标签上的动画完成时发出 */
  _translateTabComplete = new Subject<AnimationEvent>();

  /** 标签主体的移位索引位置，其中0代表活动中心标签。 */
  _position: TabBodyPositionState;

  @Input()
  set position(position: number) {
    if (position < 0) {
      this._position = 'left';
    } else if (position > 0) {
      this._position = 'right';
    } else {
      this._position = 'center';
    }
  }

  /** 当该标签居中进入视图时，该标签应该出现的原始位置。 */
  _origin: TabBodyOriginState;
  @Input()
  set origin(origin: number) {
    if (origin == null) {
      return;
    }

    if (origin <= 0 || origin > 0) {
      this._origin = 'left';
    } else {
      this._origin = 'right';
    }
  }

  @Input() animationDuration: string = '500ms';

  @ViewChild(CdkPortalOutlet, { static: true })
  _portalHost: CdkPortalOutlet;

  constructor(private _elementRef: ElementRef, renderer: Renderer2) {
    renderer.addClass(_elementRef.nativeElement, 'sim-tab-body');
    this._translateTabComplete
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe(event => {
        // 如果到中心的转换完成，则发出一个事件
        if (this._isCenterPosition(event.toState) && this._isCenterPosition(this._position)) {
          this._onCentered.emit();
        }

        if (this._isCenterPosition(event.fromState) && !this._isCenterPosition(this._position)) {
          this._afterLeavingCenter.emit();
        }
      });
  }

  ngOnInit() {
    if (this._position === 'center' && this._origin) {
      this._position = this._origin === 'left' ? 'left-origin-center' : 'right-origin-center';
    }
  }

  ngOnDestroy(): void {
    this._translateTabComplete.complete();
  }

  _onTranslateTabStarted(e: AnimationEvent): void {
    const isCentering = this._isCenterPosition(e.toState);
    this._beforeCentering.emit(isCentering);
    if (isCentering) {
      this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
    }
  }

  _onTranslateTabComplete(e: AnimationEvent): void {
    // 如果到中心的转换完成，则发出一个事件。
    if (this._isCenterPosition(e.toState) && this._isCenterPosition(this._position)) {
      this._onCentered.emit();
    }

    if (this._isCenterPosition(e.fromState) && !this._isCenterPosition(this._position)) {
      this._afterLeavingCenter.emit();
    }
  }

  /** 不管原始位置如何，提供的位置状态是否被认为是中心的。 */
  _isCenterPosition(position: TabBodyPositionState | string): boolean {
    return position === 'center' || position === 'left-origin-center' || position === 'right-origin-center';
  }
}
