import { Component, OnInit } from '@angular/core';
import { SimTreeControl, SimTreeDataSource, SimTreeFlattener } from '@ngx-simple/simple-ui/tree';

@Component({
  selector: 'doc-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {
  treeControl = new SimTreeControl();
  dataSource: SimTreeDataSource<any, any>;

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new SimTreeDataSource(this.treeControl, new SimTreeFlattener());
    const dig = (path = '0', level = 3) => {
      const list = [];
      for (let i = 0; i < 10; i += 1) {
        const key = `${path}-${i}`;
        const treeNode = {
          display: key,
          key,
          expanded: true,
          children: [],
          isLeaf: false
        };

        if (level > 0) {
          treeNode.children = dig(key, level - 1);
        } else {
          treeNode.isLeaf = true;
        }

        list.push(treeNode);
      }
      return list;
    };
    this.dataSource.data = dig();
  }
}
