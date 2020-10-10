import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@doc/shared';
import { SelectExampleModule } from '@doc/examples/select-example/select-example.module';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { SimSelectModule } from '@ngx-simple/simple-ui/select';
import { SelectComponent } from './select.component';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: SelectComponent,
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
  imports: [RouterModule.forChild(routes), SimSelectModule, SharedModule, PlaygroundComponentsModule, SelectExampleModule],
  declarations: [SelectComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class SelectModule {}
