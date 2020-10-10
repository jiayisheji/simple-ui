import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimFormActionsDirective } from './actions.directive';
import { SimErrorDirective } from './error.directive';
import { SimFormFieldLabelComponent } from './form-field-label.component';
import { SimFormFieldComponent } from './form-field.component';
import { SimFormDirective } from './form.directive';
import { SimHasErrorDirective } from './has-error.directive';
import { SimHintDirective } from './hint.directive';
import { SimPrefixDirective } from './prefix.directive';
import { SimSuffixDirective } from './suffix.directive';

@NgModule({
  declarations: [
    SimFormFieldComponent,
    SimFormDirective,
    SimErrorDirective,
    SimHasErrorDirective,
    SimHintDirective,
    SimSuffixDirective,
    SimPrefixDirective,
    SimFormActionsDirective,
    SimFormFieldLabelComponent
  ],
  imports: [CommonModule],
  exports: [
    SimFormFieldComponent,
    SimFormDirective,
    SimErrorDirective,
    SimHasErrorDirective,
    SimHintDirective,
    SimSuffixDirective,
    SimPrefixDirective,
    SimFormActionsDirective,
    SimFormFieldLabelComponent
  ]
})
export class SimFormFieldModule {}
