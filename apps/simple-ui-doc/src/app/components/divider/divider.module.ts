import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { DividerExampleModule } from '@doc/examples/divider-example/divider-example.module';
import { SharedModule } from '@doc/shared';
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
import { ApiComponent } from './api/api.component';
import { DividerComponent } from './divider.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: DividerComponent,
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
  imports: [RouterModule.forChild(routes), SimDividerModule, SharedModule, PlaygroundComponentsModule, DividerExampleModule],
  declarations: [DividerComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class DividerModule {}
