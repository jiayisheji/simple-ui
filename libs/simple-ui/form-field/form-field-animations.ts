import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export const simFormFieldAnimations: {
  readonly transitionMessages: AnimationTriggerMetadata;
} = {
  transitionMessages: trigger('transitionMessages', [
    state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
    transition('void => enter', [style({ opacity: 0, transform: 'translateY(-100%)' }), animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')])
  ])
};
