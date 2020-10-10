import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimRadioGroupFormControlDirective } from './radio-group-form-control.directive';
import { SimRadioComponent, SimRadioGroupDirective } from './radio.component';

@NgModule({
  declarations: [SimRadioComponent, SimRadioGroupDirective, SimRadioGroupFormControlDirective],
  imports: [CommonModule],
  exports: [SimRadioComponent, SimRadioGroupDirective, SimRadioGroupFormControlDirective]
})
export class SimRadioModule {}
