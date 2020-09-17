import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimExpansionPanelHeaderComponent } from './expansion-panel-header.component';
import { SimExpansionPanelComponent } from './expansion-panel.component';
import { SimExpansionComponent } from './expansion.component';
import {
  SimExpansionPanelActionRowDirective,
  SimExpansionPanelContentDirective,
  SimPanelDescriptionDirective,
  SimPanelTitleDirective
} from './expansion.directive';

@NgModule({
  declarations: [
    SimExpansionPanelContentDirective,
    SimExpansionPanelActionRowDirective,
    SimPanelDescriptionDirective,
    SimPanelTitleDirective,
    SimExpansionComponent,
    SimExpansionPanelComponent,
    SimExpansionPanelHeaderComponent
  ],
  imports: [CommonModule, PortalModule],
  exports: [
    SimExpansionPanelContentDirective,
    SimExpansionPanelActionRowDirective,
    SimPanelDescriptionDirective,
    SimPanelTitleDirective,
    SimExpansionComponent,
    SimExpansionPanelComponent,
    SimExpansionPanelHeaderComponent
  ]
})
export class SimExpansionModule {}
