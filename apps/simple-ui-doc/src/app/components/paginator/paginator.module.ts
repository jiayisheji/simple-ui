import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@doc/shared';
import { PaginatorExampleModule } from '@doc/examples/paginator-example/paginator-example.module';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { SimPaginatorModule } from '@ngx-simple/simple-ui/paginator';
import { PaginatorComponent } from './paginator.component';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: PaginatorComponent,
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
  imports: [RouterModule.forChild(routes), SimPaginatorModule, SharedModule, PlaygroundComponentsModule, PaginatorExampleModule],
  declarations: [PaginatorComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class PaginatorModule {}
