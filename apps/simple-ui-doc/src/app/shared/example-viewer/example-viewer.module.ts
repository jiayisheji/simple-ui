import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimHighlightModule } from '@ngx-simple/highlight';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import { SimTabsModule } from '@ngx-simple/simple-ui/tabs';
import { SimTooltipModule } from '@ngx-simple/simple-ui/tooltip';
import { ExampleUrlPipe, ExampleViewerComponent, ExampleViewerLabelDirective } from './example-viewer.component';

@NgModule({
  declarations: [ExampleViewerComponent, ExampleViewerLabelDirective, ExampleUrlPipe],
  imports: [CommonModule, SimButtonModule, ClipboardModule, SimHighlightModule, SimTabsModule, SimIconModule, SimTooltipModule],
  exports: [
    ExampleViewerComponent,
    ExampleViewerLabelDirective,
    SimIconModule,
    SimTooltipModule,
    SimTabsModule,
    SimHighlightModule,
    ClipboardModule,
    SimButtonModule
  ]
})
export class ExampleViewerModule {}
