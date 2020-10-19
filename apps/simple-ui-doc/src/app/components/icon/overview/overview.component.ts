import { Component, OnInit } from '@angular/core';
import { icon } from '../icon';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  items: string[] = icon;

  constructor() {}

  ngOnInit(): void {}

  clipboard(name: string): string {
    return `<sim-icon svgIcon="${name}"></sim-icon>`;
  }

  copied(event: boolean, dom: HTMLLIElement) {
    if (event) {
      dom.classList.add('doc-copied');
      setTimeout(() => {
        dom.classList.remove('doc-copied');
      }, 800);
    }
  }
}
