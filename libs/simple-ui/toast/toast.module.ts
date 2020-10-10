import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimOutletModule } from '@ngx-simple/core/outlet';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import { SimToastContainerComponent } from './toast-container.component';
import { SimToastComponent } from './toast.component';

@NgModule({
  declarations: [SimToastComponent, SimToastContainerComponent],
  imports: [CommonModule, OverlayModule, PortalModule, SimIconModule, SimOutletModule],
  exports: [SimToastContainerComponent]
})
export class SimToastModule {}
