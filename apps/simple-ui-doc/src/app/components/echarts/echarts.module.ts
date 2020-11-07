import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { EchartsExampleModule } from '@doc/examples/echarts-example/echarts-example.module';
import { SharedModule } from '@doc/shared';
import { SimEchartsModule } from '@ngx-simple/echarts';
import { ApiComponent } from './api/api.component';
import { EchartsComponent } from './echarts.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: EchartsComponent,
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
  imports: [RouterModule.forChild(routes), SimEchartsModule, SharedModule, PlaygroundComponentsModule, EchartsExampleModule],
  declarations: [EchartsComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class EchartsModule {}
