import { animate, AnimationTriggerMetadata, query, stagger, style, transition, trigger } from '@angular/animations';

export const SimTreeAnimations: AnimationTriggerMetadata = trigger('treeCollapseMotion', [
  transition('* => *', [
    query(
      'sim-tree-node:leave',
      [style({ overflow: 'hidden' }), stagger(0, [animate(`150ms cubic-bezier(0.645, 0.045, 0.355, 1)`, style({ height: 0 }))])],
      {
        optional: true
      }
    ),
    query(
      'sim-tree-node:enter',
      [
        style({ overflow: 'hidden', height: 0 }),
        stagger(0, [animate(`150ms cubic-bezier(0.645, 0.045, 0.355, 1)`, style({ overflow: 'hidden', height: '*' }))])
      ],
      {
        optional: true
      }
    )
  ])
]);
