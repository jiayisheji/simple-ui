import { NgModule } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SimNprogressService } from './nprogress.service';

@NgModule({})
export class SimNprogressRouterModule {
  constructor(nprogress: SimNprogressService, router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        nprogress.start();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        nprogress.complete();
      }
    });
  }
}
