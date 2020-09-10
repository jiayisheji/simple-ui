import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@doc/shared';
import { AlertExampleModule } from '@doc/examples/alert-example/alert-example.module';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { SimAlertModule } from '@ngx-simple/simple-ui/alert';
import { AlertComponent } from './alert.component';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: AlertComponent,
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
  imports: [RouterModule.forChild(routes), SimAlertModule, SharedModule, PlaygroundComponentsModule, AlertExampleModule],
  declarations: [AlertComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class AlertModule {}
