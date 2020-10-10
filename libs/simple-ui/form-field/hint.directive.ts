import { Directive, HostBinding, Input } from '@angular/core';
let nextUniqueId = 0;
@Directive({
  selector: '[simHint], [sim-hint], sim-hint',
  host: {
    class: 'sim-hint',
    '[class.sim-hint-end]': 'align === "end"',
    // 删除align属性以防止它干扰布局
    '[attr.align]': 'null'
  }
})
export class SimHintDirective {
  @HostBinding('class.sim-hint') hostClass = true;

  /** 对齐方式 start 左对齐 end 右对齐 */
  @Input() align: 'start' | 'end' = 'start';

  @Input()
  @HostBinding('attr.id')
  id = `sim-hint-${nextUniqueId++}`;
}
