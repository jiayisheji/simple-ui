import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
import { DividerOverviewExample } from './divider-overview/divider-overview-example';

@NgModule({
  declarations: [DividerOverviewExample],
  imports: [CommonModule, SimDividerModule],
  exports: [DividerOverviewExample]
})
export class DividerExampleModule {}
