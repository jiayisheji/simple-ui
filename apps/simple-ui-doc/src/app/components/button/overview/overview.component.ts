import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  loading: boolean;

  constructor() {}

  ngOnInit(): void {}

  setLoading() {
    this.loading = true;
    const timer = setTimeout(() => {
      this.loading = false;
      clearTimeout(timer);
    }, 2000);
  }
}
