import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimAnchorComponent, SimButtonComponent, SimButtonGroupDirective, SimLinkComponent } from './button.component';

@NgModule({
  declarations: [SimButtonComponent, SimAnchorComponent, SimLinkComponent, SimButtonGroupDirective],
  imports: [CommonModule],
  exports: [SimButtonComponent, SimAnchorComponent, SimLinkComponent, SimButtonGroupDirective]
})
export class SimButtonModule {}
