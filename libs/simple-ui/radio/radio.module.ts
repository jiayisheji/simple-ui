import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimRadioComponent, SimRadioGroupDirective } from './radio.component';

@NgModule({
  declarations: [SimRadioComponent, SimRadioGroupDirective],
  imports: [CommonModule],
  exports: [SimRadioComponent, SimRadioGroupDirective]
})
export class SimRadioModule {}
