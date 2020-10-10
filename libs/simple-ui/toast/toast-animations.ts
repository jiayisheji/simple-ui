import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export const simToastAnimations: {
  readonly toastState: AnimationTriggerMetadata;
  readonly toastContainerState: AnimationTriggerMetadata;
} = {
  toastContainerState: trigger('state', [
    state(
      'void, hidden',
      style({
        transform: 'scale(0.8)',
        opacity: 0
      })
    ),
    state(
      'visible',
      style({
        transform: 'scale(1)',
        opacity: 1
      })
    ),
    transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    transition(
      '* => void, * => hidden',
      animate(
        '75ms cubic-bezier(0.4, 0.0, 1, 1)',
        style({
          opacity: 0
        })
      )
    )
  ]),

  toastState: trigger('toast', [
    state('enter', style({ opacity: 1, transform: 'translateY(0)' })),
    transition('* => enter', [style({ opacity: 0, transform: 'translateY(-50%)' }), animate('100ms linear')]),
    state('leave', style({ transform: 'translateY(-50%)' })),
    transition('* => leave', [style({ transform: 'translateY(0)' }), animate('100ms linear')])
  ])
};
