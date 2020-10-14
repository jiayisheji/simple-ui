import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { SwitchExampleModule } from '@doc/examples/switch-example/switch-example.module';
import { SharedModule } from '@doc/shared';
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
import { SimSwitchModule } from '@ngx-simple/simple-ui/switch';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';
import { SwitchComponent } from './switch.component';

const routes: Routes = [
  {
    path: '',
    component: SwitchComponent,
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
    SimSwitchModule,
    SharedModule,
    SimDividerModule,
    PlaygroundComponentsModule,
    SwitchExampleModule
  ],
  declarations: [SwitchComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class SwitchModule {}
