import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { ButtonGroupExampleModule } from '@doc/examples/button-group-example/button-group-example.module';
import { SharedModule } from '@doc/shared';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { SimButtonToggleModule } from '@ngx-simple/simple-ui/button-toggle';
import { SimDropdownModule } from '@ngx-simple/simple-ui/dropdown';
import { ApiComponent } from './api/api.component';
import { ButtonGroupComponent } from './button-group.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: ButtonGroupComponent,
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
    SimButtonToggleModule,
    SimButtonModule,
    SimDropdownModule,
    SharedModule,
    PlaygroundComponentsModule,
    ButtonGroupExampleModule
  ],
  declarations: [ButtonGroupComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class ButtonGroupModule {}
