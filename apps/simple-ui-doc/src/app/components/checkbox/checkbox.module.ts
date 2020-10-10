import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@doc/shared';
import { CheckboxExampleModule } from '@doc/examples/checkbox-example/checkbox-example.module';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { SimCheckboxModule } from '@ngx-simple/simple-ui/checkbox';
import { CheckboxComponent } from './checkbox.component';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: CheckboxComponent,
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
  imports: [RouterModule.forChild(routes), SimCheckboxModule, SharedModule, PlaygroundComponentsModule, CheckboxExampleModule],
  declarations: [CheckboxComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class CheckboxModule {}
