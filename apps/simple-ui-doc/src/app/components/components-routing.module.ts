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
      { path: 'form-field', loadChildren: () => import('./form-field/form-field.module').then(m => m.FormFieldModule) },
      { path: 'select', loadChildren: () => import('./select/select.module').then(m => m.SelectModule) },
      { path: 'paginator', loadChildren: () => import('./paginator/paginator.module').then(m => m.PaginatorModule) },
      { path: 'radio', loadChildren: () => import('./radio/radio.module').then(m => m.RadioModule) },
      { path: 'checkbox', loadChildren: () => import('./checkbox/checkbox.module').then(m => m.CheckboxModule) },
      { path: 'toast', loadChildren: () => import('./toast/toast.module').then(m => m.ToastModule) },
      { path: 'switch', loadChildren: () => import('./switch/switch.module').then(m => m.SwitchModule) },
      { path: 'tree', loadChildren: () => import('./tree/tree.module').then(m => m.TreeModule) },
      { path: 'icon', loadChildren: () => import('./icon/icon.module').then(m => m.IconModule) },
      { path: 'drawer', loadChildren: () => import('./drawer/drawer.module').then(m => m.DrawerModule) },
      // { path: 'table', loadChildren: () => import('./table/table.module').then(m => m.TableModule) },
      { path: 'chips', loadChildren: () => import('./chips/chips.module').then(m => m.ChipsModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule {}
