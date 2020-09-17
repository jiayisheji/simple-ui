import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimPseudoCheckboxModule } from '@ngx-simple/simple-ui/pseudo-checkbox';
import { SimOptgroupComponent, SimOptgroupLabelDirective } from './optgroup.component';
import { SimOptionComponent } from './option.component';

@NgModule({
  declarations: [SimOptionComponent, SimOptgroupLabelDirective, SimOptgroupComponent],
  imports: [CommonModule, SimPseudoCheckboxModule],
  exports: [SimOptionComponent, SimOptgroupLabelDirective, SimOptgroupComponent]
})
export class SimOptionModule {}
