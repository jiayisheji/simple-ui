import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimTextareaAutosizeDirective } from './autosize.directive';
import { SimInputDirective } from './input.directive';

@NgModule({
  declarations: [SimInputDirective, SimTextareaAutosizeDirective],
  imports: [CommonModule],
  exports: [SimInputDirective, SimTextareaAutosizeDirective]
})
export class SimInputModule {}
