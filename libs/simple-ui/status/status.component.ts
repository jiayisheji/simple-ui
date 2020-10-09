import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * 状态
 * - success 成功
 * - error 失败
 * - processing 处理中
 * - warning 警告
 * - default 默认
 */
export type Status = 'success' | 'error' | 'processing' | 'warning' | 'default';

@Component({
  selector: 'sim-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-status',
    '[class.sim-status-default]': 'status == "default"',
    '[class.sim-status-success]': 'status == "success"',
    '[class.sim-status-error]': 'status == "error"',
    '[class.sim-status-processing]': 'status == "processing"',
    '[class.sim-status-warning]': 'status == "warning"'
  }
})
export class SimStatusComponent {
  /** 状态 */
  @Input() status: Status = 'default';

  /** 自定义颜色 */
  @Input() color: string;
}
