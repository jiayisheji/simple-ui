import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { CanDisable, mixinDisabled, MixinElementRefBase } from '@ngx-simple/core/common-behaviors';

export type SimPseudoCheckboxState = 'unchecked' | 'checked' | 'indeterminate';

export const _SimPseudoCheckboxMixinBase = mixinDisabled(MixinElementRefBase);

@Component({
  selector: 'sim-pseudo-checkbox',
  template: '',
  styleUrls: ['./pseudo-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-pseudo-checkbox',
    '[class.sim-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
    '[class.sim-pseudo-checkbox-checked]': 'state === "checked"'
  }
})
export class SimPseudoCheckboxComponent extends _SimPseudoCheckboxMixinBase implements CanDisable {
  /** 显示复选框的状态 */
  @Input()
  state: SimPseudoCheckboxState = 'unchecked';

  @Input()
  @HostBinding('class.sim-pseudo-checkbox-disabled')
  disabled: boolean;

  constructor(_elementRef: ElementRef) {
    super(_elementRef);
  }
}
