import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { SafeAny } from '@ngx-simple/core/types';
import { Subject } from 'rxjs';
import { Constructor } from './constructor';

/**
 * 提供程序, 用于定义窗体控件在显示错误消息方面的行为方式。
 */
@Injectable({ providedIn: 'root' })
export class ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.touched || (form && form.submitted)));
  }
}

/** 当控件无效且脏时匹配的错误状态 */
@Injectable()
export class ShowOnDirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
  }
}

export interface CanUpdateErrorState {
  errorState: boolean;
  errorStateMatcher: ErrorStateMatcher;
  readonly stateChanges: Subject<void>;
  updateErrorState(): void;
}

export type CanUpdateErrorStateCtor = Constructor<CanUpdateErrorState>;

export interface HasErrorState {
  _defaultErrorStateMatcher: ErrorStateMatcher;
  _parentForm: NgForm;
  _parentFormGroup: FormGroupDirective;
  ngControl: NgControl;
}

/**
 * Mixin 用 updateErrorState 方法增加指令。 对于具有 errorState 的组件, 需要更新 errorState。
 */

export function mixinErrorState<T extends Constructor<HasErrorState>>(base: T): Constructor<CanUpdateErrorState> & T {
  return class extends base {
    /** 组件是否处于错误状态。 */
    errorState = false;

    errorStateMatcher: ErrorStateMatcher;

    /**
     * 每当输入状态发生变化时发出的流, 这样包装 SimFormField 需要运行更改检测。
     */
    readonly stateChanges = new Subject<void>();

    constructor(...args: SafeAny[]) {
      super(...args);
    }

    updateErrorState() {
      const oldState = this.errorState;
      const parent = this._parentFormGroup || this._parentForm;
      const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      const control = this.ngControl ? (this.ngControl.control as FormControl) : null;
      const newState = matcher.isErrorState(control, parent);
      if (newState !== oldState) {
        this.errorState = newState;
        this.stateChanges.next();
      }
    }
  };
}
