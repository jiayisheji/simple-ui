import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { TreeExampleModule } from '@doc/examples/tree-example/tree-example.module';
import { SharedModule } from '@doc/shared';
import { SimTreeModule } from '@ngx-simple/simple-ui/tree';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';
import { TreeComponent } from './tree.component';

const routes: Routes = [
  {
    path: '',
    component: TreeComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: OverviewComponent
      },
      {
        path: 'api',
        component: ApiComponent
      },
      {
        path: 'examples',
        component: ExamplesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SimTreeModule, SharedModule, PlaygroundComponentsModule, TreeExampleModule],
  declarations: [TreeComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class TreeModule {}
