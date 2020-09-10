import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { BooleanInput } from '@ngx-simple/core/coercion';
import { InputBoolean } from '@ngx-simple/core/decorators';

@Directive({
  selector: '[simDividerInnerText], sim-divider-inner-text'
})
export class SimDividerTextInnerDirective {
  constructor(private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2) {
    this._renderer.addClass(this._elementRef.nativeElement, 'sim-divider-inner-text');
  }
}

/**
 *
 * Example:
 * ```html
 * <sim-divider></sim-divider>
 * <sim-divider [margin]="true"></sim-divider>
 * <sim-divider [margin]="'10px'"></sim-divider>
 * <sim-divider [margin]="'10px 20px'"></sim-divider>
 * <sim-divider [margin]="'10px 20px 30px'"></sim-divider>
 * <sim-divider dashed></sim-divider>
 * <div>
 *    <a href="">登录</a>
 *    <sim-divider vertical></sim-divider>
 *    <a href="">注册</a>
 *  </div>
 *  <sim-divider>我是分割线</sim-divider>
 *  <sim-divider align="start">我是分割线</sim-divider>
 *  <sim-divider align="end"><sim-icon svgIcon="icon-plus"></sim-icon> Add</sim-divider>
 * ```
 */
@Component({
  selector: 'sim-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimDividerComponent implements OnChanges, AfterContentInit {
  static ngAcceptInputType_vertical: BooleanInput;
  static ngAcceptInputType_inset: BooleanInput;
  static ngAcceptInputType_dashed: BooleanInput;
  /**
   * 是否垂直显示
   * - true =>horizontal
   * - false => vertical
   */
  @Input()
  @HostBinding('class.sim-divider-vertical')
  @InputBoolean<SimDividerComponent, 'vertical'>()
  vertical: boolean = false;

  /**
   * 是否虚线
   * true => border-style: dashed
   * false => border-style: solid
   */
  @Input()
  @HostBinding('class.sim-divider-dashed')
  @InputBoolean<SimDividerComponent, 'dashed'>()
  dashed: boolean = false;

  /**
   * 是否为插入分隔线
   */
  @Input()
  @HostBinding('class.sim-divider-inset')
  @InputBoolean<SimDividerComponent, 'inset'>()
  inset: boolean = false;

  /**
   * 分隔线边距 参考`style.margin`语法
   * - 单值语法  所有边缘 举例： margin: 1em;
   * - 二值语法  纵向 横向 举例： margin: 5% auto;
   * - 三值语法 上 横向 下 举例： margin: 1em auto 2em;
   * - 四值语法 上 右 下 左 举例： margin: 2px 1em 0 auto;
   */
  @Input()
  @HostBinding('style.margin')
  margin: string;

  /**
   * 文本显示位置
   * - start align="start"
   * - end align="end"
   * - default align="center"
   */
  @Input()
  @HostBinding('attr.align')
  align: 'start' | 'end';

  @HostBinding('class.sim-divider-horizontal')
  get horizontalClass() {
    return !this.vertical;
  }

  @ContentChild(SimDividerTextInnerDirective, { read: ElementRef }) _dividerText: ElementRef<HTMLElement>;

  /** 检查是否有文本 */
  hasText: boolean = !this.vertical;

  private _element: HTMLElement;

  constructor(private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2) {
    this._element = this._elementRef.nativeElement;
    this._renderer.addClass(this._element, 'sim-divider');
    this._renderer.setAttribute(this._element, 'role', 'separator');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { vertical } = changes;
    if (vertical) {
      this._checkText();
    }
  }

  ngAfterContentInit() {
    this._checkText();
  }

  private _checkText() {
    // 如果发现是垂直显示，不需要检查是否有文本强制丢弃
    // 如果没有投影也直接丢弃
    // 如果投影里没有内容直接丢弃
    if (this.vertical || !this._dividerText || !this._dividerText.nativeElement.innerHTML.trim()) {
      this._renderer.removeClass(this._element, 'sim-divider-text');
      this.hasText = false;
      return;
    }
    this._renderer.addClass(this._element, 'sim-divider-text');
  }
}
