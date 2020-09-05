import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'doc-playground-components',
  templateUrl: './playground-components.component.html',
  styleUrls: ['./playground-components.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlaygroundComponentsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
