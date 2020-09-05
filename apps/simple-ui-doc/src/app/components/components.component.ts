import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { capitalize } from '@ngx-simple/simple-ui/core/utils';
import { ComponentLink, PLAYGROUND_COMPONENTS } from './playground-components';

@Component({
  selector: 'doc-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentsComponent implements OnInit {
  headline: string = '组件';
  subheading: string = 'Components';

  components = PLAYGROUND_COMPONENTS;

  constructor() {}

  ngOnInit(): void {}

  setHeadline(item: ComponentLink) {
    this.headline = item.name;
    this.subheading = item.path ? capitalize(item.path) : '';
  }
}
