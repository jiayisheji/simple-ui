import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { FormFieldExampleModule } from '@doc/examples/form-field-example/form-field-example.module';
import { SharedModule } from '@doc/shared';
import { SimFormFieldModule } from '@ngx-simple/simple-ui/form-field';
import { SimInputModule } from '@ngx-simple/simple-ui/input';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { FormFieldComponent } from './form-field.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: FormFieldComponent,
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
    SharedModule,
    PlaygroundComponentsModule,
    FormFieldExampleModule,
    SimInputModule
  ],
  declarations: [FormFieldComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class FormFieldModule {}
