import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

/** SimDialog使用的动画。 */
export const simDialogAnimations: {
  readonly slideDialog: AnimationTriggerMetadata;
} = {
  /**
   * 将对话框滑入和滑出视图并淡化不透明度的动画。
   */
  slideDialog: trigger('slideDialog', [
    // 注意：`enter`动画不会过渡到`translate3d（0，0，0）scale（1）`之类的东西，
    // 因为由于某种原因明确地指定了转换，导致IE模糊对话内容并抽取动画表现。 将它作为'none'解决这两个问题。
    state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
    state('enter', style({ transform: 'none', opacity: 1 })),
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 }))),
    transition('* => void, * => exit', animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 })))
  ])
};
