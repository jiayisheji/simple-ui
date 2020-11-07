import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@doc/env';
import { SimEventModule } from '@ngx-simple/core/events';
import { SIM_ECHARTS_OPTIONS } from '@ngx-simple/echarts';
import { SIM_HIGHLIGHT_OPTIONS } from '@ngx-simple/highlight';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { SimIconService } from '@ngx-simple/simple-ui/icon';
import { SimNprogressHttpModule, SimNprogressModule, SimNprogressRouterModule } from '@ngx-simple/simple-ui/nprogress';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SimEventModule,
    AppRoutingModule,
    SimButtonModule,
    SimNprogressModule,
    SimNprogressRouterModule,
    SimNprogressHttpModule
  ],
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
    },
    {
      provide: SIM_ECHARTS_OPTIONS,
      useValue: {
        echarts: () => import('echarts/dist/echarts'),
        registerMap: {
          assets: '/assets/echarts'
        },
        themes: [
          {
            name: 'roma',
            url: '/assets/echarts/roma.project.json'
          },
          {
            name: 'customed',
            url: '/assets/echarts/customed.project.json'
          },
          {
            name: 'infographic',
            url: '/assets/echarts/infographic.project.json'
          },
          {
            name: 'macarons',
            url: '/assets/echarts/macarons.project.json'
          },
          {
            name: 'wonderland',
            url: '/assets/echarts/wonderland.project.json'
          }
        ]
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconService: SimIconService) {
    // 设置加载svg字体目录
    iconService.addSvgIconAssets(environment.host + '/assets/icon/');
  }
}
