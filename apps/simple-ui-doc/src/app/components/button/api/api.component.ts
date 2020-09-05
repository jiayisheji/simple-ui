import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'doc-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
  importText: string = `import { SimButtonModule } from '@ngx-simple/simple-ui/button';`;
  constructor() {}

  ngOnInit(): void {}
}
