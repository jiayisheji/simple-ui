import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimOutletModule } from '@ngx-simple/core/outlet';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import { SimEmptyComponent, SimEmptyFooterDirective } from './empty.component';

@NgModule({
  declarations: [SimEmptyComponent, SimEmptyFooterDirective],
  imports: [CommonModule, SimIconModule, SimOutletModule],
  exports: [SimEmptyComponent, SimEmptyFooterDirective, SimIconModule, SimOutletModule]
})
export class SimEmptyModule {}
