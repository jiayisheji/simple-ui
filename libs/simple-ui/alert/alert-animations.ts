import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export const slideAlertMotion: AnimationTriggerMetadata = trigger('slideAlertMotion', [
  transition(':leave', [
    style({ opacity: 1, transform: 'scaleY(1)', transformOrigin: '0% 0%' }),
    animate(
      `0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86)`,
      style({
        opacity: 0,
        transform: 'scaleY(0)',
        transformOrigin: '0% 0%'
      })
    )
  ])
]);
