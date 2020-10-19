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
      { path: 'tree', loadChildren: () => import('./tree/tree.module').then(m => m.TreeModule) }
      //   { path: 'datepicker', loadChildren: () => import('./datepicker/datepicker.module').then(m => m.DatepickerModule) },
      //   { path: 'timepicker', loadChildren: () => import('./timepicker/timepicker.module').then(m => m.TimepickerModule) },
      //   { path: 'colorpicker', loadChildren: () => import('./colorpicker/colorpicker.module').then(m => m.ColorpickerModule) },
      //   { path: 'table', loadChildren: () => import('./table/table.module').then(m => m.TableModule) },
      //   { path: 'data-grid', loadChildren: () => import('./data-grid/data-grid.module').then(m => m.DataGridModule) },
      //   { path: 'echarts', loadChildren: () => import('./echarts/echarts.module').then(m => m.EchartsModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule {}
