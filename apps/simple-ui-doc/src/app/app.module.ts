import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@doc/env/environment';
import { SIM_HIGHLIGHT_OPTIONS } from '@ngx-simple/highlight';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { SimIconService } from '@ngx-simple/simple-ui/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, SimButtonModule],
  providers: [
    {
      provide: SIM_HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconService: SimIconService) {
    // 设置加载svg字体目录
    iconService.addSvgIconAssets(environment.host + 'assets/icon/');
  }
}
