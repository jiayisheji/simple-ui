import { Component, OnInit } from '@angular/core';
import { SimDropdownActionsChange } from '@ngx-simple/simple-ui/dropdown';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  selectionChange($event: SimDropdownActionsChange<string>) {
    console.log('more actions', '操作按钮 ' + $event.value);
  }
}
