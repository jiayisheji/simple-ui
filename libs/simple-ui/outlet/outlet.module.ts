import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimTemplateOutletDirective } from './outlet.directive';

@NgModule({
  imports: [CommonModule],
  exports: [SimTemplateOutletDirective],
  declarations: [SimTemplateOutletDirective]
})
export class SimOutletModule {}
