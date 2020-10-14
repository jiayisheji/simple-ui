import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@doc/shared';
import { ToastExampleModule } from '@doc/examples/toast-example/toast-example.module';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { SimToastModule } from '@ngx-simple/simple-ui/toast';
import { ToastComponent } from './toast.component';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: ToastComponent,
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
  imports: [RouterModule.forChild(routes), SimToastModule, SharedModule, PlaygroundComponentsModule, ToastExampleModule],
  declarations: [ToastComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class ToastModule {}
