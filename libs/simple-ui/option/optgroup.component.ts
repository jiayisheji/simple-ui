import { ChangeDetectionStrategy, Component, Directive, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { CanDisable, mixinDisabled, MixinElementRefBase } from '@ngx-simple/core/common-behaviors';

// 用于唯一组id的计数器
let _uniqueOptgroupIdCounter = 0;

const _SimOptgroupBase = mixinDisabled(MixinElementRefBase);

@Component({
  selector: 'sim-optgroup',
  templateUrl: './optgroup.component.html',
  styleUrls: ['./optgroup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-optgroup',
    role: 'group'
  }
})
export class SimOptgroupComponent extends _SimOptgroupBase implements CanDisable {
  @Input()
  @HostBinding('class.sim-optgroup-disabled')
  disabled: boolean;

  // 选项组的标签
  @Input() label: string;

  /** 基础标签的唯一id */
  _labelId = `sim-optgroup-label-${_uniqueOptgroupIdCounter++}`;
}

@Directive({
  selector: '[SimOptgroupLabel], [sim-optgroup-label], sim-optgroup-label',
  host: {
    class: 'sim-optgroup-label',
    '[attr.id]': '_parent && _parent._labelId'
  }
})
export class SimOptgroupLabelDirective {
  constructor(protected _parent: SimOptgroupComponent) {}
}
