import { ThemePalette } from '@ngx-simple/core/common-behaviors';

export class SimNprogressDefaultOptions {
  /** 是否显示流星划过效果 */
  meteor?: boolean = true;
  /** 是否显示spinner */
  spinner?: boolean = true;
  /** 厚重模式 */
  thick?: boolean = false;
  /** css transition-timing-function */
  ease?: string = 'linear';
  /** spinner显示位置 */
  spinnerPosition?: 'left' | 'right' = 'right';
  /** 主题 */
  color?: ThemePalette = 'primary';
  /** 最大值，默认100 */
  max?: number = 100;
  /** 最小值，默认8 */
  min?: number = 8;
  /** 运动速度，默认200ms */
  speed?: number = 200;
  /** 缓冲动画运动速度，默认300ms */
  trickleSpeed?: number = 300;
  /** 抖动时间 */
  debounceTime?: number = 0;
  /** 缓冲动画函数转换 */
  trickleFunc?: (n: number) => number;
}
