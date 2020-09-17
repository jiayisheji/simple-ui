import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

const ANIMATION_IN = `0.2s cubic-bezier(0.9, 0, 0.3, 0.7)`;
const ANIMATION_OUT = `0.2s cubic-bezier(0.7, 0.3, 0.1, 1)`;

/** simDropdown动画 */
export const simDropdownAnimations: {
  readonly dropdownState: AnimationTriggerMetadata;
} = {
  /** dropdown输入和输出的动画。 */
  dropdownState: trigger('state', [
    state(
      'bottom',
      style({
        opacity: 1,
        transform: 'scaleY(1)',
        transformOrigin: '0% 0%'
      })
    ),
    state(
      'top',
      style({
        opacity: 1,
        transform: 'scaleY(1)',
        transformOrigin: '0% 100%'
      })
    ),
    transition('void => bottom', [
      style({
        opacity: 0,
        transform: 'scaleY(0.8)',
        transformOrigin: '0% 0%'
      }),
      animate(ANIMATION_IN)
    ]),
    transition('bottom => void', [
      animate(
        ANIMATION_OUT,
        style({
          opacity: 0,
          transform: 'scaleY(0.8)',
          transformOrigin: '0% 0%'
        })
      )
    ]),
    transition('void => top', [
      style({
        opacity: 0,
        transform: 'scaleY(0.8)',
        transformOrigin: '0% 100%'
      }),
      animate(ANIMATION_IN)
    ]),
    transition('top => void', [
      animate(
        ANIMATION_OUT,
        style({
          opacity: 0,
          transform: 'scaleY(0.8)',
          transformOrigin: '0% 100%'
        })
      )
    ])
  ])
};
