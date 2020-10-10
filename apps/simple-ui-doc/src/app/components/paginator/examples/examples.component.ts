import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'doc-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {
  pageIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
