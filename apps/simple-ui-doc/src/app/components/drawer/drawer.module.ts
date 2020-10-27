import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { DrawerExampleModule } from '@doc/examples/drawer-example/drawer-example.module';
import { SharedModule } from '@doc/shared';
import { SimDrawerModule } from '@ngx-simple/simple-ui/drawer';
import { SimSelectModule } from '@ngx-simple/simple-ui/select';
import { ApiComponent } from './api/api.component';
import { DrawerComponent } from './drawer.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: DrawerComponent,
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
  imports: [RouterModule.forChild(routes), SimDrawerModule, SharedModule, SimSelectModule, PlaygroundComponentsModule, DrawerExampleModule],
  declarations: [DrawerComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class DrawerModule {}
