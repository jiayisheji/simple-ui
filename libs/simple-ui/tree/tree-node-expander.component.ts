import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sim-tree-node-expander',
  template: `
    <ng-container *ngIf="expandable">
      <span class="sim-tree-node-expander-indicator"></span>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-tree-node-expander',
    '[class.sim-tree-node-expander-expanded]': 'expanded',
    '[class.sim-tree-node-expander-noop]': '!expandable',
    '[class.sim-tree-node-expander-collapsed]': '!expanded'
  }
})
export class SimTreeNodeExpanderComponent {
  /** 是否可展开 */
  @Input() expandable: boolean;
  /** 是否展开状态 */
  @Input() expanded: boolean;
}
