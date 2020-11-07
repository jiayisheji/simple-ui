import { Component, OnInit } from '@angular/core';
import { SimChipInputEvent } from '@ngx-simple/simple-ui/chips';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  tags: string[] = ['Unremovable', 'Tag 2', 'Tag 3'];

  constructor() {}

  ngOnInit(): void {}

  removed(event) {
    console.log(event);
  }

  tagRemoved(removedTag: string) {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  handleInputConfirm(input: HTMLInputElement) {
    const value = input.value.trim();
    if (value && this.tags.indexOf(value) === -1) {
      this.tags = [...this.tags, value];
      input.value = '';
    }
  }

  simChipInputTokenEnd(event: SimChipInputEvent) {
    const value = event.value.trim();
    if (value && this.tags.indexOf(value) === -1) {
      this.tags = [...this.tags, value];
      event.input.value = '';
    }
  }
}
