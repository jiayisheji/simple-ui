import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { InputExampleModule } from '@doc/examples/input-example/input-example.module';
import { SharedModule } from '@doc/shared';
import { SimFormFieldModule } from '@ngx-simple/simple-ui/form-field';
import { SimInputModule } from '@ngx-simple/simple-ui/input';
import { SimToastModule } from '@ngx-simple/simple-ui/toast';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { InputComponent } from './input.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: InputComponent,
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
    SimInputModule,
    SharedModule,
    PlaygroundComponentsModule,
    InputExampleModule,
    SimFormFieldModule,
    SimToastModule
  ],
  declarations: [InputComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class InputModule {}
