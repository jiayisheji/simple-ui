import { animate, animateChild, AnimationTriggerMetadata, query, state, style, transition, trigger } from '@angular/animations';

export const simSelectAnimations: {
  readonly transformPanelWrap: AnimationTriggerMetadata;
  readonly transformPanel: AnimationTriggerMetadata;
} = {
  /**
   * 这个动画确保在关闭选择时调用选择的浮层面板动画
   * see https://github.com/angular/angular/issues/23302
   */
  transformPanelWrap: trigger('transformPanelWrap', [
    transition('* => void', query('@transformPanel', [animateChild()], { optional: true }))
  ]),

  transformPanel: trigger('transformPanel', [
    state(
      'void',
      style({
        transform: 'scaleY(0.8)',
        minWidth: '100%',
        opacity: 0
      })
    ),
    state(
      'showing',
      style({
        opacity: 1,
        minWidth: 'calc(100% + 32px)', // 32px = 2 * 16px padding
        transform: 'scaleY(1)'
      })
    ),
    state(
      'showing-multiple',
      style({
        opacity: 1,
        minWidth: 'calc(100% + 64px)', // 64px = 48px padding on the left + 16px padding on the right
        transform: 'scaleY(1)'
      })
    ),
    transition('void => *', animate('120ms cubic-bezier(0, 0, 0.2, 1)')),
    transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 })))
  ])
};
