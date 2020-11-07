import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { ChipsExampleModule } from '@doc/examples/chips-example/chips-example.module';
import { SharedModule } from '@doc/shared';
import { SimChipsModule } from '@ngx-simple/simple-ui/chips';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import { ApiComponent } from './api/api.component';
import { ChipsComponent } from './chips.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: ChipsComponent,
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
  imports: [RouterModule.forChild(routes), SimChipsModule, SimIconModule, SharedModule, PlaygroundComponentsModule, ChipsExampleModule],
  declarations: [ChipsComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class ChipsModule {}
