import { Directive, forwardRef } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS } from '@angular/forms';

/**
 * 在模板驱动的复选框中验证 sim-checkbox 的 required 属性。
 * 当前的 CheckboxRequiredValidator 只适用于“input type=checkbox”，而不适用于sim-checkbox。
 */
@Directive({
  selector: `sim-checkbox[required][formControlName], sim-checkbox[required][formControl], sim-checkbox[required][ngModel]`,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SimCheckboxRequiredValidator),
      multi: true
    }
  ]
})
// tslint:disable-next-line: directive-class-suffix
export class SimCheckboxRequiredValidator extends CheckboxRequiredValidator {}
