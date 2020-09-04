import { HttpClient } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, publishReplay, refCount } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CodeLoaderService {
  constructor(private _http: HttpClient) {}

  getCodeFromUrl(url: string): Observable<string> {
    return this.fetchFile(url);
  }

  private fetchFile(url: string): Observable<string | never> {
    if (!this._http) {
      throw Error(
        'Could not find HttpClient provider for use with Angular Simple UI icons. ' +
          'Please include the HttpClientModule from @angular/common/http in your ' +
          'app imports.'
      );
    }
    // 检查URL是否有效
    if (isRelativeUrl(url) || isUrl(url)) {
      return this._http.get(url, { responseType: 'text' }).pipe(
        // 捕获响应
        publishReplay(1),
        refCount(),
        catchError((err: Error) => {
          console.error('[SimHighlight]: Unable to fetch the URL!', err.message);
          return EMPTY;
        })
      );
    }
    return EMPTY;
  }
}

function isRelativeUrl(url: string) {
  const regExp = /(\/|\/([\w#!:.?+=&%@!\-\/]))/;
  return regExp.test(url);
}

function isUrl(url: string) {
  const regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regExp.test(url);
}

@Pipe({
  name: 'codeFromUrl'
})
export class CodeFromUrlPipe implements PipeTransform {
  constructor(private _loader: CodeLoaderService) {}

  transform(url: string): Observable<string> {
    return this._loader.getCodeFromUrl(url).pipe(map((text: string) => text && `${text.trim()}`));
  }
}
