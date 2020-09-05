import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SimTabsModule } from '@ngx-simple/simple-ui/tabs';
import { PlaygroundComponentsComponent } from './playground-components.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ApiComponent } from './api/api.component';

@NgModule({
  declarations: [PlaygroundComponentsComponent, ViewerComponent, ApiComponent],
  imports: [CommonModule, RouterModule, SimTabsModule],
  exports: [PlaygroundComponentsComponent, ViewerComponent]
})
export class PlaygroundComponentsModule {}
