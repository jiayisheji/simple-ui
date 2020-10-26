import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimCheckboxRequiredValidator } from './checkbox-required-validator';
import { SimCheckboxComponent, SimCheckboxGroupDirective } from './checkbox.component';

@NgModule({
  declarations: [SimCheckboxComponent, SimCheckboxRequiredValidator, SimCheckboxGroupDirective],
  imports: [CommonModule, ObserversModule],
  exports: [SimCheckboxComponent, SimCheckboxRequiredValidator, SimCheckboxGroupDirective]
})
export class SimCheckboxModule {}
