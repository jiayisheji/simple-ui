import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimOutletModule } from '@ngx-simple/core/outlet';
import { SimSelectModule } from '@ngx-simple/simple-ui/select';
import { SIM_PAGINATOR_INTL_PROVIDER } from './paginator-intl';
import { SimPaginatorComponent } from './paginator.component';

@NgModule({
  declarations: [SimPaginatorComponent],
  imports: [CommonModule, SimOutletModule, SimSelectModule],
  exports: [SimPaginatorComponent],
  providers: [SIM_PAGINATOR_INTL_PROVIDER]
})
export class SimPaginatorModule {}
