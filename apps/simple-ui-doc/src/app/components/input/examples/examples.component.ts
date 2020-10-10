import { Component, OnInit } from '@angular/core';
import { SimToastService } from '@ngx-simple/simple-ui/toast';

@Component({
  selector: 'doc-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {
  value: string;

  passwordVisible = false;
  password?: string;

  constructor(private toast: SimToastService) {}

  ngOnInit(): void {}

  onSearch(value: string) {
    if (!value || !value.trim()) {
      this.toast.warning('请输入内容');
      return;
    }
    this.toast.info(value);
  }
}
