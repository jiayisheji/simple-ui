import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimAnchorComponent, SimButtonComponent, SimLinkComponent } from './button.component';

@NgModule({
  declarations: [SimButtonComponent, SimAnchorComponent, SimLinkComponent],
  imports: [CommonModule],
  exports: [SimButtonComponent, SimAnchorComponent, SimLinkComponent]
})
export class SimButtonModule {}
