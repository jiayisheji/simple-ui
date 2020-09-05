import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
import { ComponentsRoutingModule } from './components-routing.module';
import { ComponentsComponent } from './components.component';

@NgModule({
  declarations: [ComponentsComponent],
  imports: [SimDividerModule, CommonModule, ComponentsRoutingModule]
})
export class ComponentsModule {}
