import { Component, OnInit } from '@angular/core';
import { indicate } from '@ngx-simple/core/operators';
import { of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  loading$ = new Subject<boolean>();

  constructor() {}

  ngOnInit(): void {}

  setLoading() {
    of(null).pipe(delay(2000), indicate(this.loading$)).subscribe();
  }
}
