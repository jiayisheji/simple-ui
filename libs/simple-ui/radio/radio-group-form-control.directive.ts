import { Directive, DoCheck, Host, Input, OnChanges, OnDestroy, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorState, ErrorStateMatcher, mixinErrorState } from '@ngx-simple/core/common-behaviors';
import { SimFormFieldControl } from '@ngx-simple/simple-ui/form-field';
import { RadioValue, SimRadioGroupDirective } from './radio.component';

export class SimRadioGroupBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}
export const _SimRadioGroupMixinBase = mixinErrorState(SimRadioGroupBase);

@Directive({
  selector: 'sim-radio-group[formControlName]',
  providers: [
    {
      provide: SimFormFieldControl,
      useExisting: SimRadioGroupFormControlDirective
    }
  ]
})
export class SimRadioGroupFormControlDirective extends _SimRadioGroupMixinBase
  implements SimFormFieldControl<RadioValue>, OnChanges, DoCheck, OnDestroy, CanUpdateErrorState {
  // Implemented as part of SimFormFieldControl.
  value: RadioValue;
  // Implemented as part of SimFormFieldControl.
  required: boolean;
  // Implemented as part of SimFormFieldControl.
  disabled: boolean;

  // Implemented as part of SimFormFieldControl.
  @Input() id: string = this.radioGroup.name;

  // Implemented as part of SimFormFieldControl.
  @Input() errorStateMatcher: ErrorStateMatcher;

  // Implemented as part of SimFormFieldControl.
  placeholder: string = '';
  // Implemented as part of SimFormFieldControl.
  focused = false;
  // Implemented as part of SimFormFieldControl.
  get empty(): boolean {
    return this.radioGroup.selected == null;
  }
  // Implemented as part of SimFormFieldControl.
  controlType = 'sim-radio';
  // Implemented as part of SimFormFieldControl.
  autofilled = false;

  constructor(
    @Host() private radioGroup: SimRadioGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    if (this.ngControl) {
      // 注意: 我们在这里提供了值访问器，而不是“providers”，以避免`into a circular`错误。
      this.ngControl.valueAccessor = radioGroup;
    }
  }

  ngOnChanges() {
    if (this.ngControl) {
      this.stateChanges.next();
    }
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  // Implemented as part of SimFormFieldControl.
  onContainerClick() {}

  // Implemented as part of SimFormFieldControl.
  setDescribedByIds(ids: string[]) {}
}
