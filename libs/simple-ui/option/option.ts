import { QueryList } from '@angular/core';
import { SimOptgroupComponent } from './optgroup.component';
import { SimOptionComponent } from './option.component';

/**
 * 计算在指定选项之前的选项组标签数量。
 * optionIndex 开始计算的选项的索引。
 * options 所有选项的平面列表。
 * optionGroups 所有选项组的平面列表。
 */
export function _countGroupLabelsBeforeOption(
  optionIndex: number,
  options: QueryList<SimOptionComponent>,
  optionGroups: QueryList<SimOptgroupComponent>
): number {
  if (optionGroups.length) {
    const optionsArray = options.toArray();
    const groups = optionGroups.toArray();
    let groupCounter = 0;

    for (let i = 0; i < optionIndex + 1; i++) {
      if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
        groupCounter++;
      }
    }

    return groupCounter;
  }

  return 0;
}

/**
 * 确定要滚动面板的位置，以便选择要进入视图。
 * optionIndex 可以在视图中滚动的选项的索引。
 * optionHeight 高度的选择。
 * currentScrollPosition 面板的当前滚动位置。
 * panelHeight 面板的高度。
 */
export function _getOptionScrollPosition(
  optionIndex: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number
): number {
  const optionOffset = optionIndex * optionHeight;

  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}
