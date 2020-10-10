import { Directive, Input } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

/**
 * form 显示布局
 * - horizontal 水平排列 form-field block 布局 label 和 input inline 布局
 * - vertical 垂直排列 form-field block 布局 label 和 input block 布局
 * - inline 内联排列 form-field inline 布局 label 和 input inline 布局
 */
export type FormLayout = 'horizontal' | 'vertical' | 'inline';

@Directive({
  selector: 'form[simForm],form[sim-form]',
  host: {
    class: 'sim-form',
    '[class.sim-form-horizontal]': 'layout === "horizontal"',
    '[class.sim-form-vertical]': 'layout === "vertical"',
    '[class.sim-form-inline]': 'layout === "inline"'
  }
})
export class SimFormDirective {
  /**
   * 表单布局方式
   * - horizontal 水平排列
   * - vertical 垂直排列
   * - inline 内联排列
   */
  @Input() layout: FormLayout = 'horizontal';

  /** 全局配置当前form下所有label的width */
  @Input() labelWidth: string = '10%';

  constructor(form: FormGroupDirective) {
    // 代理递归触发验证
    form.ngSubmit.subscribe(() => {
      this.validateAllFormFields(form.control);
    });
  }

  /**
   * 递归触发验证
   * @param formGroup
   */
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty();
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
