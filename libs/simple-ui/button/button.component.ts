import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { BooleanInput } from '@ngx-simple/core/coercion';
import {
  CanColor,
  CanDisable,
  CanSize,
  mixinColor,
  mixinDisabled,
  MixinElementRefBase,
  mixinSize,
  ThemePalette,
  ThemeSize
} from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';

@Directive({
  selector: `sim-button-group`,
  host: {
    class: 'sim-button-group',
    role: 'group'
  },
  exportAs: 'simButtonGroup'
})
export class SimButtonGroupDirective {
  @Input()
  @HostBinding('class.sim-button-group-spaced')
  @InputBoolean<SimButtonGroupDirective, 'spaced'>()
  spaced: boolean;

  /**
   * 按钮尺寸
   */
  @Input()
  size: ThemeSize;

  constructor(_elementRef: ElementRef, protected renderer: Renderer2) {}
}

const BUTTON_HOST_ATTRIBUTES = [
  'sim-button',
  'sim-flat-button',
  'sim-outlined-button',
  'sim-raised-button',
  'sim-stroked-button',
  'sim-icon-button'
];

/**
 * 按钮类型
 * 1. sim-button 文本按钮 文本按钮通常用于不太重要的操作
 * 2. sim-stroked-button 描边按钮 由于描边的关系，概括的按钮比文本按钮用于更多的强调。
 * 3. sim-outlined-button 轮廓按钮 由于轮廓的关系，概括的按钮比文本按钮用于更多的强调。
 * 3. sim-flat-button 填充按钮 填充的按钮使用颜色填充和阴影，因此更加强调。
 * 4. sim-icon-button 图标按钮 填充的按钮使用颜色填充和阴影，因此更加强调。
 */

const _ButtonMixinBase = mixinColor(mixinDisabled(mixinSize(MixinElementRefBase, 'medium')));

@Component({
  selector: `button[sim-button], button[sim-flat-button], button[sim-icon-button],
  button[sim-stroked-button], button[sim-outlined-button], button[sim-raised-button]`,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'simButton'
})
export class SimButtonComponent extends _ButtonMixinBase implements OnInit, AfterViewInit, OnDestroy, CanDisable, CanColor, CanSize {
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_loading: BooleanInput;
  static ngAcceptInputType_fluid: BooleanInput;
  static ngAcceptInputType_dashed: BooleanInput;
  static ngAcceptInputType_pilled: BooleanInput;

  /**
   * 是否加载中
   */
  @Input()
  @HostBinding('class.sim-button-loading')
  @InputBoolean<SimButtonComponent, 'loading'>()
  loading: boolean = false;

  /**
   * 是否充满自适应父级宽度
   */
  @Input()
  @HostBinding('class.sim-button-fluid')
  @InputBoolean<SimButtonComponent, 'fluid'>()
  fluid: boolean = false;

  /**
   * 是否是虚线 只适用于 `stroked`、`outlined` 轮廓按钮
   */
  @Input()
  @HostBinding('class.sim-button-dashed')
  @InputBoolean<SimButtonComponent, 'dashed'>()
  dashed: boolean = false;

  /**
   * 是否圆形胶量形状按钮
   */
  @Input()
  @HostBinding('class.sim-button-pilled')
  @InputBoolean<SimButtonComponent, 'pilled'>()
  pilled: boolean = false;

  /**
   * 按钮主题
   */
  @Input()
  color: ThemePalette;

  /**
   * 按钮尺寸
   */
  @Input()
  size: ThemeSize;

  @Input()
  @HostBinding('class.sim-button-disabled')
  disabled: boolean;

  constructor(_elementRef: ElementRef, protected renderer: Renderer2, protected _focusMonitor: FocusMonitor) {
    super(_elementRef);
    // <button>如果不填type在各大浏览器解析不一样，强制设为<button type="button"> 避免出现bug
    const getHostElement = this._getHostElement() as HTMLButtonElement;
    if (_elementRef && !getHostElement.hasAttribute('type')) {
      this.renderer.setAttribute(getHostElement, 'type', 'button');
    }
  }

  ngOnInit(): void {
    const getHostElement = this._getHostElement() as HTMLButtonElement;
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (getHostElement.hasAttribute(attr)) {
        getHostElement.classList.add(attr);
      }
    }
    getHostElement.classList.add('sim-button-base');
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  focus(origin: FocusOrigin = 'program', options?: FocusOptions): void {
    this._focusMonitor.focusVia(this._getHostElement(), origin, options);
  }

  protected _getHostElement(): HTMLButtonElement | HTMLAnchorElement {
    return this._elementRef.nativeElement as HTMLButtonElement | HTMLAnchorElement;
  }
}

@Component({
  selector: `a[sim-button], a[sim-flat-button], a[sim-icon-button],
  a[sim-stroked-button], a[sim-outlined-button], a[sim-raised-button]`,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'simAnchor',
  host: {
    '[attr.tabindex]': 'disabled ? -1 : tabIndex || 0'
  }
})
export class SimAnchorComponent extends SimButtonComponent implements OnInit {
  /** 按钮的tabIndex */
  @Input() tabIndex: number;

  constructor(elementRef: ElementRef, renderer: Renderer2, _focusMonitor: FocusMonitor) {
    super(elementRef, renderer, _focusMonitor);
  }

  /**
   * a标签点击事件处理
   * @param event
   */
  @HostListener('click', ['$event'])
  _haltDisabledEvents(event: Event) {
    // 禁用按钮不应应用任何操作
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

@Component({
  selector: ` a[sim-link-button]`,
  template: '<ng-content></ng-content>',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'simLink',
  host: {
    '[attr.tabindex]': 'disabled ? -1 : tabIndex || 0'
  }
})
export class SimLinkComponent extends SimAnchorComponent implements OnInit {
  static ngAcceptInputType_disabled: BooleanInput;

  /** 按钮的tabIndex */
  @Input() tabIndex: number;

  @Input()
  @InputBoolean<SimLinkComponent, 'disabled'>()
  @HostBinding('class.sim-button-disabled')
  disabled: boolean;

  constructor(_elementRef: ElementRef, _renderer: Renderer2, _focusMonitor: FocusMonitor) {
    super(_elementRef, _renderer, _focusMonitor);
    _renderer.addClass(_elementRef.nativeElement, 'sim-link-button');
  }

  ngOnInit(): void {
    if (!this.color) {
      this.color = 'primary';
    }
  }
}
