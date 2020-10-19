import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimOutletModule } from '@ngx-simple/core/outlet';
import { SimPseudoCheckboxModule } from '@ngx-simple/simple-ui/pseudo-checkbox';
import { SimTreeNodeExpanderComponent } from './tree-node-expander.component';
import { SimTreeNodePaddingComponent } from './tree-node-padding.component';
import { SimTreeNodeComponent } from './tree-node.component';
import { SimTreeComponent } from './tree.component';

@NgModule({
  declarations: [SimTreeComponent, SimTreeNodeComponent, SimTreeNodeExpanderComponent, SimTreeNodePaddingComponent],
  imports: [CommonModule, SimPseudoCheckboxModule, SimOutletModule, ScrollingModule],
  exports: [SimTreeComponent]
})
export class SimTreeModule {}
