import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  Renderer2,
  SkipSelf,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { CanColor, mixinColor, MixinElementRefBase, ThemePalette } from '@ngx-simple/core/common-behaviors';
import { merge, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { SimErrorDirective } from './error.directive';
import { simFormFieldAnimations } from './form-field-animations';
import { SimFormFieldControl } from './form-field-control';
import { SimFormFieldLabelComponent } from './form-field-label.component';
import { SimFormDirective } from './form.directive';
import { SimHintDirective } from './hint.directive';
import { SimPrefixDirective } from './prefix.directive';
import { SimSuffixDirective } from './suffix.directive';

/** 注入标记，可用于注入'SimFormFieldComponent'实例。它作为实际'SimFormFieldComponent'类的替代标记，这会导致'SimFormFieldComponent'类及其组件元数据的不必要保留。 */
export const SIM_FORM_FIELD = new InjectionToken<SimFormFieldComponent>('SIM_FORM_FIELD');

/** form-field 的外观样式 */
export type SimFormFieldAppearance = 'standard' | 'fill' | 'outline' | 'underline';

/**
 * 表示可以使用'SIM_FORM_FIELD_DEFAULT_OPTIONS'注入令牌配置的表单字段的默认选项。
 */
export interface SimFormFieldDefaultOptions {
  appearance?: SimFormFieldAppearance;
  hideRequiredMarker?: boolean;
}

/**
 * 注入令牌，可用于配置应用程序中所有form-field的默认选项。
 */
export const SIM_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken<SimFormFieldDefaultOptions>('SIM_FORM_FIELD_DEFAULT_OPTIONS');

const _SimFormFieldMixinBase = mixinColor(MixinElementRefBase, 'primary');

@Component({
  selector: 'sim-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss', './form-field-input.scss'],
  animations: [simFormFieldAnimations.transitionMessages],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SIM_FORM_FIELD, useExisting: SimFormFieldComponent }],
  host: {
    class: 'sim-form-field',
    '[class.sim-form-field-appearance-standard]': 'appearance == "standard"',
    '[class.sim-form-field-appearance-fill]': 'appearance == "fill"',
    '[class.sim-form-field-appearance-outline]': 'appearance == "outline"',
    '[class.sim-form-field-appearance-underline]': 'appearance == "underline"',
    '[class.sim-form-field-has-label]': '!!_labelChild',
    '[class.sim-form-field-focused]': '_control && _control.focused',
    '[class.sim-form-field-invalid]': '_control && _control.errorState',
    '[class.sim-form-field-disabled]': '_control && _control.disabled',
    '[class.sim-form-field-autofilled]': '_control && _control.autofilled',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")'
  }
})
export class SimFormFieldComponent extends _SimFormFieldMixinBase implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, CanColor {
  @Input() color: ThemePalette;

  /**
   * 显示外观
   * - standard 标准的，使用子SimFormFieldControl的样式
   * - outline 忽略子SimFormFieldControl的样式 使用边框包裹
   * - underline 忽略子SimFormFieldControl的样式 使用下划线包裹
   * - fill 忽略子SimFormFieldControl的样式 使用背景包裹
   */
  @Input() appearance: SimFormFieldAppearance = 'standard';

  /** 标签显示宽度 */
  @Input() labelWidth: string;

  subscriptAnimationState = '';

  @ContentChild(SimFormFieldControl) _controlNonStatic: SimFormFieldControl<unknown>;
  @ContentChild(SimFormFieldControl, { static: true })
  _controlStatic: SimFormFieldControl<unknown>;

  get _control() {
    // 为了同时支持Ivy和ViewEngine，我们需要这个解决方案。
    return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
  }

  set _control(value) {
    this._explicitFormFieldControl = value;
  }
  private _explicitFormFieldControl: SimFormFieldControl<unknown>;

  @ContentChild(SimFormFieldLabelComponent) _labelChild: SimFormFieldLabelComponent;
  @ContentChildren(SimErrorDirective) _errorChildren: QueryList<SimErrorDirective>;
  @ContentChildren(SimHintDirective) _hintChildren: QueryList<SimHintDirective>;
  @ContentChildren(SimPrefixDirective) _prefixChildren: QueryList<SimPrefixDirective>;
  @ContentChildren(SimSuffixDirective) _suffixChildren: QueryList<SimSuffixDirective>;

  @ViewChild('connectionContainer', { static: true }) _connectionContainerRef: ElementRef;
  @ViewChild('inputContainer', { static: true }) _inputContainerRef: ElementRef;

  _hideRequiredMarker: boolean = true;

  private _destroyed = new Subject<void>();

  constructor(
    _elementRef: ElementRef,
    private renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    @SkipSelf() @Optional() private formDirective: SimFormDirective,
    @Optional() @Inject(SIM_FORM_FIELD_DEFAULT_OPTIONS) private _defaults: SimFormFieldDefaultOptions
  ) {
    super(_elementRef);
    if (_defaults) {
      this.appearance = _defaults.appearance || 'standard';
      this._hideRequiredMarker = _defaults.hideRequiredMarker;
    }
  }

  ngOnInit(): void {
    if (this.formDirective) {
      this.labelWidth = this.labelWidth || this.formDirective.labelWidth;
    }
  }

  ngAfterViewInit() {
    // 避免加载时出现动画。
    this.subscriptAnimationState = 'enter';
    this._changeDetectorRef.detectChanges();
  }

  ngAfterContentInit(): void {
    this._validateControlChild();

    const control = this._control;

    // 如果`<sim-form-label>` 赋值给 _control 和 _hideRequiredMarker 必备属性
    if (this._labelChild) {
      this._labelChild._control = control;
      this._labelChild._hideRequiredMarker = this._hideRequiredMarker;
      this._labelChild.markForCheck();
    }

    if (control.controlType) {
      this.renderer.addClass(this._elementRef.nativeElement, `sim-form-field-type-${control.controlType}`);
    }

    // 订阅子控件状态的更改，以更新表单字段UI
    // fix startWith Deprecation warning
    control.stateChanges.pipe(startWith(null as void), takeUntil(this._destroyed)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
      if (this._labelChild) {
        this._labelChild.markForCheck();
      }
    });

    // 如果值发生更改，则运行更改检测。
    const { ngControl } = control;
    if (ngControl && ngControl.valueChanges) {
      ngControl.valueChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._changeDetectorRef.markForCheck());
    }

    // 如果后缀或前缀发生更改，则运行更改检测。
    merge(this._prefixChildren.changes, this._suffixChildren.changes)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });

    // 当提示数量发生变化时描述。
    // fix startWith Deprecation warning
    this._hintChildren.changes.pipe(startWith(null as SimHintDirective), takeUntil(this._destroyed)).subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });

    // 当错误数量发生变化时描述。
    // fix startWith Deprecation warning
    this._errorChildren.changes.pipe(startWith(null as SimErrorDirective), takeUntil(this._destroyed)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** 确定是否应该将来自`NgControl`的`class`转发到`<sim-form-field>` */
  _shouldForward(prop: keyof NgControl): boolean {
    const ngControl = this._control ? this._control.ngControl : null;
    return ngControl && ngControl[prop];
  }

  /** 获取显示消息 */
  _getDisplayedMessages(): 'error' | 'hint' {
    return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState ? 'error' : 'hint';
  }

  /** 获取弹层的起始源位置 */
  getConnectedOverlayOrigin(): ElementRef {
    return this._connectionContainerRef;
  }

  /** 如果缺少表单字段的控件，则会引发错误。 */
  private _validateControlChild() {
    if (!this._control) {
      throw Error('sim-form-field must contain a SimFormFieldControl');
    }
  }

  /** 执行处理提示时所需的任何额外处理 */
  private _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }

  /**
   * 确保指定的每个'<sim-hint>'对齐最多有一个，属性被认为是'align="start"'。
   */
  private _validateHints() {
    if (this._hintChildren) {
      let startHint: SimHintDirective;
      let endHint: SimHintDirective;
      this._hintChildren.forEach((hint: SimHintDirective) => {
        if (hint.align === 'start') {
          if (startHint) {
            throw Error(`A hint was already declared for 'align="start"'.`);
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw Error(`A hint was already declared for 'align="end"'.`);
          }
          endHint = hint;
        }
      });
    }
  }

  /**
   * 设置描述子控件的元素id列表。这允许控件相应地更新其'aria-describedby`属性。
   */
  private _syncDescribedByIds() {
    if (this._control) {
      let ids: string[] = [];

      if (this._getDisplayedMessages() === 'hint') {
        const startHint = this._hintChildren ? this._hintChildren.find(hint => hint.align === 'start') : null;
        const endHint = this._hintChildren ? this._hintChildren.find(hint => hint.align === 'end') : null;

        if (startHint) {
          ids.push(startHint.id);
        }

        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids = this._errorChildren.map(error => error.id);
      }

      this._control.setDescribedByIds(ids);
    }
  }
}
