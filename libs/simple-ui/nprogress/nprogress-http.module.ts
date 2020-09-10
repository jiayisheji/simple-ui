import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SimNprogressService } from './nprogress.service';

@Injectable()
export class SimNprogressInterceptor implements HttpInterceptor {
  private _inProgressCount = 0;

  constructor(private _nprogress: SimNprogressService) {}
  // 在此之后，将会支持忽略特定请求 https://github.com/angular/angular/issues/18155
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this._inProgressCount++;
    if (!this._nprogress.ref('root').isStarted) {
      this._nprogress.start();
    }
    return next.handle(req).pipe(
      finalize(() => {
        this._inProgressCount--;
        if (this._inProgressCount === 0) {
          this._nprogress.complete();
        }
      })
    );
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SimNprogressInterceptor,
      multi: true
    }
  ]
})
export class SimNprogressHttpModule {}
