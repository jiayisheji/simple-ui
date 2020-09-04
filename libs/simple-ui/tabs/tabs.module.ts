import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimTabBodyComponent } from './tab-body.component';
import { SimTabContentHostDirective } from './tab-content-host.directive';
import { SimTabContentDirective } from './tab-content.directive';
import { SimTabHeaderComponent } from './tab-header.component';
import { TabInkBarComponent } from './tab-ink-bar.component';
import { SimTabLabelWrapperDirective } from './tab-label-wrapper.directive';
import { SimTabLabelDirective } from './tab-label.directive';
import { SimTabLinkDirective } from './tab-link.directive';
import { SimTabNavBarComponent } from './tab-nav-bar.component';
import { SimTabComponent } from './tab.component';
import { SimTabsComponent } from './tabs.component';

@NgModule({
  declarations: [
    SimTabsComponent,
    SimTabComponent,
    SimTabNavBarComponent,
    SimTabLabelDirective,
    SimTabLinkDirective,
    TabInkBarComponent,
    SimTabContentHostDirective,
    SimTabContentDirective,
    SimTabBodyComponent,
    SimTabHeaderComponent,
    SimTabLabelWrapperDirective
  ],
  imports: [CommonModule, ObserversModule, PortalModule],
  exports: [SimTabsComponent, SimTabComponent, SimTabNavBarComponent, SimTabLabelDirective, SimTabLinkDirective, SimTabContentDirective]
})
export class SimTabsModule {}
