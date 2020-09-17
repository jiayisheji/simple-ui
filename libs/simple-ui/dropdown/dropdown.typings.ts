// 显示动画触发状态 注意：center并无意义，为了VerticalConnectionPos类型匹配
export type DropdownVisibility = 'bottom' | 'top' | 'center';
// 触发的动作
export type triggerType = 'hover' | 'click';
/**
 * 显示位置
 * top 始终显示在元素上方 默认显示居中
 * bottom 始终显示在元素下方 默认显示居中
 * left 始终显示在元素左侧 默认显示居中
 * right 始终显示在元素右侧 默认显示居中
 * start 水平方向左对齐 垂直方向上对齐
 * end 水平方向右对齐 垂直方向下对齐
 */
export type DropdownPosition = 'top' | 'topStart' | 'topEnd' | 'bottom' | 'bottomStart' | 'bottomEnd';
