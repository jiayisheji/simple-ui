import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  stackPosition = 'right';
  overPosition = 'right';
  mode = 'side';
  position = 'left';
  drawerOpen: boolean;
  constructor() {}

  ngOnInit(): void {}
}
