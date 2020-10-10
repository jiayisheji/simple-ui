import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimCheckboxFormControlDirective } from './checkbox--form-control.directive';
import { SimCheckboxRequiredValidator } from './checkbox-required-validator';
import { SimCheckboxComponent, SimCheckboxGroupDirective } from './checkbox.component';

@NgModule({
  declarations: [SimCheckboxComponent, SimCheckboxRequiredValidator, SimCheckboxFormControlDirective, SimCheckboxGroupDirective],
  imports: [CommonModule, ObserversModule],
  exports: [SimCheckboxComponent, SimCheckboxRequiredValidator, SimCheckboxFormControlDirective, SimCheckboxGroupDirective]
})
export class SimCheckboxModule {}
