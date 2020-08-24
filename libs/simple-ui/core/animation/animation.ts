/**
 * 动画运动曲线
 */
export class AnimationCurves {
  // 标准
  static STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
  // 减速
  static DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
  // 加速
  static ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
  // 急速
  static SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
}
/**
 * 动画持续时间
 */
export class AnimationDurations {
  // 复杂
  static COMPLEX = '375ms';
  // 进场
  static ENTERING = '225ms';
  // 出场
  static EXITING = '195ms';
}
