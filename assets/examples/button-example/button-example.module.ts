import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import { ButtonOverviewExample } from './button-overview/button-overview-example';
@NgModule({
  declarations: [ButtonOverviewExample],
  imports: [CommonModule, SimButtonModule, SimDividerModule, SimIconModule],
  exports: [ButtonOverviewExample]
})
export class ButtonExampleModule {}
