import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimStringTemplateOutletDirective } from './string-template-outlet.directive';

@NgModule({
  imports: [CommonModule],
  exports: [SimStringTemplateOutletDirective],
  declarations: [SimStringTemplateOutletDirective]
})
export class SimOutletModule {}
