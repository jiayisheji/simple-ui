import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsComponent } from './components.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    children: [
      { path: '', redirectTo: 'button', pathMatch: 'full' },
      { path: 'button', loadChildren: () => import('./button/button.module').then(m => m.ButtonModule) },
      { path: 'divider', loadChildren: () => import('./divider/divider.module').then(m => m.DividerModule) },
      { path: 'alert', loadChildren: () => import('./alert/alert.module').then(m => m.AlertModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule {}
