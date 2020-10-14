import { Component, OnInit } from '@angular/core';
import { SimToastService, ToastType } from '@ngx-simple/simple-ui/toast';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  constructor(private toast: SimToastService) {}

  ngOnInit(): void {}

  openToast(content: string, type: ToastType) {
    this.toast[type](content);
  }
}
