import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimOutletModule } from '@ngx-simple/core/outlet';
import { SimDividerComponent } from './divider.component';

@NgModule({
  declarations: [SimDividerComponent],
  imports: [CommonModule, SimOutletModule],
  exports: [SimDividerComponent]
})
export class SimDividerModule {}
