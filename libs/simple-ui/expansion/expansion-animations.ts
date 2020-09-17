import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

/** 扩展面板动画的时间和运动曲线 */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/**
 * 扩展面板使用的动画
 *
 * 当使用ViewContainerRef.move()移动视图容器时，angular动画的`state`出现了一个bug，
 * 导致被移动组件的动画状态在退出时变为`void`，在重新进入DOM时不会再次更新。
 * 这可能导致出现扩展面板的情况，其中面板的状态为`expanded`或`collapsed`，但动画状态为`void`。
 *
 * 为了正确处理动画到下一个状态，我们在`void`和`collapse`之间进行动画，被定义为具有相同的样式。
 * 因为angular会从当前的样式移动到目标状态的样式定义，当我们从“void”的样式移动到`collapsed`的样式时，
 * 这就相当于一个noop，因为没有样式值发生变化。
 *
 * 当angular的动画状态与扩展面板的状态不同步时，expansion面板为'expanded'， angular动画为'void'，
 * 从'expanded'的有效样式(虽然是在'void'动画状态下)到`collapsed`状态的动画将按预期发生。
 *
 * Angular Bug: https://github.com/angular/angular/issues/18847
 *
 */
export const simExpansionAnimations: {
  readonly expansionHeaderHeight: AnimationTriggerMetadata;
  readonly bodyExpansion: AnimationTriggerMetadata;
} = {
  /** 展开和折叠面板标题高度的动画 */
  expansionHeaderHeight: trigger('expansionHeight', [
    state(
      'collapsed, void',
      style({
        height: '{{collapsedHeight}}'
      }),
      {
        params: { collapsedHeight: '48px' }
      }
    ),
    state(
      'expanded',
      style({
        height: '{{expandedHeight}}'
      }),
      {
        params: { expandedHeight: '64px' }
      }
    ),
    transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING))
  ]),

  /** 展开和折叠面板内容的动画 */
  bodyExpansion: trigger('bodyExpansion', [
    state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
    state('expanded', style({ height: '*', visibility: 'visible' })),
    transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING))
  ])
};
