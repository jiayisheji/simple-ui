import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { IconExampleModule } from '@doc/examples/icon-example/icon-example.module';
import { SharedModule } from '@doc/shared';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { IconComponent } from './icon.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: IconComponent,
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
  imports: [RouterModule.forChild(routes), SimIconModule, SharedModule, PlaygroundComponentsModule, IconExampleModule, ClipboardModule],
  declarations: [IconComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class IconModule {}
