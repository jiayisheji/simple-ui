import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { ButtonExampleModule } from '@doc/examples/button-example/button-example.module';
import { SharedModule } from '@doc/shared';
import { SimHighlightModule } from '@ngx-simple/highlight';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { ApiComponent } from './api/api.component';
import { ButtonComponent } from './button.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';
const routes: Routes = [
  {
    path: '',
    component: ButtonComponent,
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
    SimHighlightModule,
    SimButtonModule,
    SharedModule,
    PlaygroundComponentsModule,
    ButtonExampleModule
  ],
  declarations: [ButtonComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class ButtonModule {}
