import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), pathMatch: 'full' },
  { path: 'components', loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule) },
  { path: 'guides', loadChildren: () => import('./guides/guides.module').then(m => m.GuidesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
