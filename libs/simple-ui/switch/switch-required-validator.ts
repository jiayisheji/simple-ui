import { Directive, forwardRef, Provider } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS } from '@angular/forms';

export const MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SimSwitchRequiredValidator),
  multi: true
};

/**
 * 模板驱动表单中带有required属性的switch组件的验证器。
 * 所需表单控件的默认验证器断言控件值不是未定义的，但不适合始终定义值的switch。
 *
 * 必需的switch控件在选中时有效
 */
@Directive({
  selector: `sim-switch[required][formControlName],
             sim-switch[required][formControl], sim-switch[required][ngModel]`,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SimSwitchRequiredValidator),
      multi: true
    }
  ]
})
export class SimSwitchRequiredValidator extends CheckboxRequiredValidator {}
