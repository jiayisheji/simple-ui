import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { OnceEventPlugin } from './once.plugin';
import { PreventEventPlugin } from './prevent.plugin';
import { StopEventPlugin } from './stop.plugin';

@NgModule({
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: PreventEventPlugin,
      multi: true
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: StopEventPlugin,
      multi: true
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OnceEventPlugin,
      multi: true
    }
  ]
})
export class SimEventModule {
  constructor(@Optional() @SkipSelf() parentModule: SimEventModule) {
    if (parentModule) {
      throw new Error('Events is already loaded. Import it in the AppModule only');
    }
  }
}
