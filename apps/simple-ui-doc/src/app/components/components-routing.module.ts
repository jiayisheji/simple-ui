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
      { path: 'alert', loadChildren: () => import('./alert/alert.module').then(m => m.AlertModule) },
      { path: 'button-group', loadChildren: () => import('./button-group/button-group.module').then(m => m.ButtonGroupModule) },
      { path: 'input', loadChildren: () => import('./input/input.module').then(m => m.InputModule) },
      { path: 'table', loadChildren: () => import('./table/table.module').then(m => m.TableModule) },
      { path: 'form-field', loadChildren: () => import('./form-field/form-field.module').then(m => m.FormFieldModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule {}
