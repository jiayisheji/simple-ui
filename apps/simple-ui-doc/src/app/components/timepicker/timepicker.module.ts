import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { TimepickerExampleModule } from '@doc/examples/timepicker-example/timepicker-example.module';
import { SharedModule } from '@doc/shared';
import { SimFormFieldModule } from '@ngx-simple/simple-ui/form-field';
import { SimTimepickerModule } from '@ngx-simple/simple-ui/timepicker';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';
import { TimepickerComponent } from './timepicker.component';

const routes: Routes = [
  {
    path: '',
    component: TimepickerComponent,
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
  imports: [
    RouterModule.forChild(routes),
    SimFormFieldModule,
    SimTimepickerModule,
    SharedModule,
    PlaygroundComponentsModule,
    TimepickerExampleModule
  ],
  declarations: [TimepickerComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class TimepickerModule {}
