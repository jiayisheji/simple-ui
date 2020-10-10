import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@doc/shared';
import { RadioExampleModule } from '@doc/examples/radio-example/radio-example.module';
import { PlaygroundComponentsModule } from '@doc/components/playground-components/playground-components.module';
import { SimRadioModule } from '@ngx-simple/simple-ui/radio';
import { RadioComponent } from './radio.component';
import { ApiComponent } from './api/api.component';
import { ExamplesComponent } from './examples/examples.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: RadioComponent,
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
  imports: [RouterModule.forChild(routes), SimRadioModule, SharedModule, PlaygroundComponentsModule, RadioExampleModule],
  declarations: [RadioComponent, OverviewComponent, ApiComponent, ExamplesComponent]
})
export class RadioModule {}
