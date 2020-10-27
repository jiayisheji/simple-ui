import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export const simDrawerAnimations: {
  readonly transformDrawer: AnimationTriggerMetadata;
} = {
  transformDrawer: trigger('transform', [
    state(
      'open, open-instant',
      style({
        transform: 'none',
        visibility: 'visible'
      })
    ),
    state(
      'void',
      style({
        'box-shadow': 'none',
        visibility: 'hidden'
      })
    ),
    state(
      'stack',
      style({
        'box-shadow': 'none',
        visibility: 'hidden'
      })
    ),
    transition('void => open-instant', animate('0ms')),
    transition('void <=> open, open-instant => void', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    transition('stack <=> open, open-instant => stack', animate('0ms'))
  ])
};
