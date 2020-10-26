import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BooleanInput } from '@ngx-simple/core/coercion';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { NgStringOrTemplateRef } from '@ngx-simple/core/types';

/**
 * 区隔内容的分割线。分割线组件支持多种方向选项和内嵌文字。
 * @example
 * ```html
 * <sim-divider></sim-divider>
 * <sim-divider inset></sim-divider>
 * <sim-divider outset></sim-divider>
 * <sim-divider [margin]="'10px'"></sim-divider>
 * <sim-divider [margin]="'10px 20px'"></sim-divider>
 * <sim-divider [margin]="'10px 20px 30px'"></sim-divider>
 * <sim-divider [margin]="'10px 20px 30px 25px'"></sim-divider>
 * <sim-divider dashed></sim-divider>
 * <div>
 *    <a href="">登录</a>
 *    <sim-divider vertical></sim-divider>
 *    <a href="">注册</a>
 *  </div>
 * <sim-divider text="我是分割线"></sim-divider>
 * <sim-divider align="start" text="我是分割线"></sim-divider>
 * <sim-divider align="end" [text]="text">
 *    <ng-template #text><sim-icon svgIcon="icon-plus"></sim-icon> Add</ng-template>
 * </sim-divider>
 * ```
 */
@Component({
  selector: 'sim-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-divider',
    role: 'separator',
    '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
    '[class.sim-divider-horizontal]': '!vertical',
    '[class.sim-divider-vertical]': 'vertical',
    '[class.sim-divider-dashed]': 'dashed',
    '[class.sim-divider-inset]': 'inset',
    '[class.sim-divider-outset]': 'outset',
    '[class.sim-divider-text]': 'hasText'
  }
})
export class SimDividerComponent {
  static ngAcceptInputType_vertical: BooleanInput;
  static ngAcceptInputType_dashed: BooleanInput;
  static ngAcceptInputType_inset: BooleanInput;
  static ngAcceptInputType_outset: BooleanInput;
  /**
   * 是否垂直显示
   * - true => sim-divider-vertical
   * - false => sim-divider-horizontal
   */
  @Input()
  @InputBoolean<SimDividerComponent, 'vertical'>()
  vertical: boolean = false;

  /**
   * 是否虚线
   * true => border-style: dashed
   * false => border-style: solid
   */
  @Input()
  @InputBoolean<SimDividerComponent, 'dashed'>()
  dashed: boolean = false;

  /**
   * 是否为内凹分隔线
   */
  @Input()
  @InputBoolean<SimDividerComponent, 'inset'>()
  inset: boolean = false;

  /**
   * 是否为外凸分隔线
   */
  @Input()
  @InputBoolean<SimDividerComponent, 'outset'>()
  outset: boolean = false;

  /**
   * 指定分隔线边距 参考`style.margin`语法
   * - 单值语法  所有边缘 举例： margin: 1em;
   * - 二值语法  纵向 横向 举例： margin: 5% auto;
   * - 三值语法 上 横向 下 举例： margin: 1em auto 2em;
   * - 四值语法 上 右 下 左 举例： margin: 2px 1em 0 auto;
   */
  @Input()
  @HostBinding('style.margin')
  margin: string;

  /**
   * 分隔线内嵌文本显示位置
   * - start align="start"
   * - end align="end"
   * - default align="center"
   */
  @Input()
  @HostBinding('attr.align')
  align: 'start' | 'end';

  /**
   * 分隔线内嵌文本
   */
  @Input() text: NgStringOrTemplateRef;

  /** 分隔线是否内嵌文本 */
  get hasText(): boolean {
    // 只有水平分割线才显示文本
    if (this.text != null && !this.vertical) {
      if (this.text instanceof TemplateRef) {
        return true;
      }
      // 如果不是TemplateRef，不关系传递是上面，都将显示为字符串，先判断是否是空字串。
      return !!(this.text + '').trim().length;
    }
    return false;
  }
}
