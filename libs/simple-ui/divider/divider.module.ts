import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimDividerComponent, SimDividerTextInnerDirective } from './divider.component';

@NgModule({
  declarations: [SimDividerComponent, SimDividerTextInnerDirective],
  imports: [CommonModule],
  exports: [SimDividerComponent, SimDividerTextInnerDirective]
})
export class SimDividerModule {}
