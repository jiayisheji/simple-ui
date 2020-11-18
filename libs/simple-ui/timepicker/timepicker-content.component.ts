import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { mixinColor, MixinElementRefBase, ThemePalette } from '@ngx-simple/core/common-behaviors';
import { SimDateAdapter } from '@ngx-simple/core/datetime';
import { Subject } from 'rxjs';
import { simTimepickerAnimations } from './timepicker-animations';
import { SimTimepickerComponent } from './timepicker.component';

const _SimTimepickerContentMixinBase = mixinColor(MixinElementRefBase);

@Component({
  selector: 'sim-timepicker-content',
  templateUrl: './timepicker-content.component.html',
  styleUrls: ['./timepicker.component.scss'],
  animations: [simTimepickerAnimations.transformPanel],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-timepicker-content'
  }
})
export class SimTimepickerContentComponent<D> extends _SimTimepickerContentMixinBase {
  @Input() color: ThemePalette;

  _animationDone = new Subject<void>();

  @HostBinding('@transformPanel')
  _animationState: 'enter' | 'void' = 'enter';

  /** 对创建浮层的timepicker的引用 */
  timepicker: SimTimepickerComponent<D>;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    public _dateAdapter: SimDateAdapter<D>,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);
  }

  @HostListener('@transformPanel.done')
  _endExitAnimation() {
    this._animationDone.next();
  }

  _startExitAnimation() {
    this._animationState = 'void';

    if (this._changeDetectorRef) {
      this._changeDetectorRef.markForCheck();
    }
  }
}
