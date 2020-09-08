import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimButtonToggleComponent, SimButtonToggleGroupDirective } from './button-toggle.component';

@NgModule({
  declarations: [SimButtonToggleGroupDirective, SimButtonToggleComponent],
  imports: [CommonModule],
  exports: [SimButtonToggleGroupDirective, SimButtonToggleComponent]
})
export class SimButtonToggleModule {}
