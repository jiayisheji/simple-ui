import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

/** tabs动画 */
export const simTabsAnimations: {
  readonly translateTab: AnimationTriggerMetadata;
} = {
  /** 动画沿着X轴转运动. */
  translateTab: trigger('translateTab', [
    // 注意: transform 为“none”而不是“0”，因为有些浏览器可能引起内容模糊
    state('center, void, left-origin-center, right-origin-center', style({ transform: 'none' })),
    state('left', style({ transform: 'translate3d(-100%, 0, 0)' })),
    state('right', style({ transform: 'translate3d(100%, 0, 0)' })),
    transition('* => left, * => right, left => center, right => center', animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')),
    transition('void => left-origin-center', [
      style({ transform: 'translate3d(-100%, 0, 0)' }),
      animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')
    ]),
    transition('void => right-origin-center', [
      style({ transform: 'translate3d(100%, 0, 0)' }),
      animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')
    ])
  ])
};
