import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

/** card-reveal动画 */
export const simCardAnimations: {
  readonly translateCard: AnimationTriggerMetadata;
} = {
  /** 动画沿着Y轴转运动. */
  translateCard: trigger('translateCard', [
    transition(':enter', [
      style({ transform: 'translate3d(0, 100%, 0)' }),
      animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translate3d(0, 0, 0)' }))
    ]),
    transition(':leave', [animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translate3d(0, 100%, 0)' }))])
  ])
};
