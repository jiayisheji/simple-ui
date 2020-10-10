import { Directive, Inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { toArray } from '@ngx-simple/core/coercion';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SimFormFieldComponent, SIM_FORM_FIELD } from './form-field.component';

export class SimHasErrorContext<T> {
  $implicit: T[] = null;
  simHasError: T[] = null;
}

@Directive({
  selector: '[simHasError]'
})
export class SimHasErrorDirective implements OnDestroy {
  /**
   * 错误字段
   *
   * angular内置错误字段：
   * - Validators.required => 'required'
   * - Validators.minLength => 'minLength'
   * - Validators.maxLength => 'maxLength'
   * - Validators.pattern => 'pattern'
   */
  @Input()
  set simHasError(condition: string | string[]) {
    this._context.$implicit = this._context.simHasError = toArray(condition);
    this._updateView();
  }

  private _context: SimHasErrorContext<string> = new SimHasErrorContext();

  private unsubscribe$: Subscription;

  constructor(
    private _templateRef: TemplateRef<SimHasErrorContext<string>>,
    private _viewContainer: ViewContainerRef,
    @Inject(SIM_FORM_FIELD) private _formField: SimFormFieldComponent
  ) {}

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }

  private _updateView() {
    const { _control } = this._formField;
    if (!_control) {
      return;
    }
    const { ngControl } = _control;
    if (!ngControl) {
      return;
    }
    /** 把错误字段转成数组 */
    const errors = this._context.simHasError;
    /** 检查错误方法 */
    const hasError = () => errors.some(errorCode => ngControl.hasError(errorCode));

    /** 初始化错误 一般都是 required */
    if (hasError()) {
      this._viewContainer.createEmbeddedView(this._templateRef, this._context);
    }

    /** 订阅当前表单控件状态 */
    this.unsubscribe$ = ngControl.statusChanges
      .pipe(
        tap(() => this._viewContainer.clear()),
        filter((status: string) => status === 'INVALID'),
        filter(() => hasError())
      )
      .subscribe(() => {
        this._viewContainer.createEmbeddedView(this._templateRef, this._context);
      });
  }
}
