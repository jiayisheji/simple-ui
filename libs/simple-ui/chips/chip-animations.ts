import { animate, AnimationTriggerMetadata, query, stagger, style, transition, trigger } from '@angular/animations';

export const SimChipAnimations: AnimationTriggerMetadata = trigger('chipFadeMotion', [
  transition('* => *', [
    query(
      'sim-chip:leave',
      [style({ opacity: 1 }), stagger(0, [animate(`150ms cubic-bezier(0.645, 0.045, 0.355, 1)`, style({ opacity: 0 }))])],
      {
        optional: true
      }
    ),
    query(
      'sim-chip:enter',
      [style({ opacity: 0 }), stagger(0, [animate(`150ms cubic-bezier(0.645, 0.045, 0.355, 1)`, style({ opacity: 1 }))])],
      {
        optional: true
      }
    )
  ])
]);
