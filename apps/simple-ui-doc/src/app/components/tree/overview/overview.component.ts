import { Component, OnInit, ViewChild } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { SimTreeComponent, SimTreeControl, SimTreeDataSource, SimTreeFlattener, SimTreeTransformer } from '@ngx-simple/simple-ui/tree';

const data = [
  {
    id: 1,
    name: '1',
    children: [
      {
        id: 11,
        name: '11'
      },
      {
        id: 12,
        name: '12'
      }
    ]
  },
  {
    id: 2,
    name: '2',
    children: [
      {
        id: 21,
        name: '21'
      },
      {
        id: 22,
        name: '22'
      },
      {
        id: 23,
        name: '23'
      }
    ]
  },
  {
    id: 3,
    name: '3',
    children: [
      {
        id: 31,
        name: '31'
      },
      {
        id: 32,
        name: '32'
      },
      {
        id: 33,
        name: '33'
      }
    ]
  }
];

const nodes = [
  {
    title: '0-0',
    key: '0-0',
    expanded: true,
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0', isLeaf: true },
          { title: '0-0-0-1', key: '0-0-0-1', isLeaf: true },
          { title: '0-0-0-2', key: '0-0-0-2', isLeaf: true }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0', isLeaf: true },
          { title: '0-0-1-1', key: '0-0-1-1', isLeaf: true },
          { title: '0-0-1-2', key: '0-0-1-2', isLeaf: true }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2',
        isLeaf: true
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0', isLeaf: true },
      { title: '0-1-0-1', key: '0-1-0-1', isLeaf: true },
      { title: '0-1-0-2', key: '0-1-0-2', isLeaf: true }
    ]
  },
  {
    title: '0-2',
    key: '0-2',
    isLeaf: true
  }
];

class TreeTransformer extends SimTreeTransformer<any> {
  /**
   * 获取显示内容，用于显示其内容的节点字段的值
   */
  getDisplay(node): string {
    return node.title;
  }
}

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @ViewChild('tree') tree: SimTreeComponent<SafeAny>;

  dataSource: SimTreeDataSource<any, any>;

  treeControl = new SimTreeControl();

  multiple: boolean;

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new SimTreeDataSource(this.treeControl, new SimTreeFlattener(new TreeTransformer()));

    this.dataSource.data = nodes;
  }

  onSelectChange($event) {
    console.log('onSelectChange', $event);
  }

  onCheckedChange($event) {
    console.log('onCheckedChange', $event);
  }

  onExpandChange($event) {
    console.log('onExpandChange', $event);
  }

  expandAll() {
    this.treeControl.expandAll();
  }
  collapseAll() {
    this.treeControl.collapseAll();
  }
  setCheckedNodes() {
    this.treeControl.setCheckedKeys(['0-2']);
  }

  setSelectMode() {
    this.multiple = !this.multiple;
    this.treeControl.setSelectMode(this.multiple);
  }

  private uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line: no-bitwise
      const r = (Math.random() * 16) | 0;
      // tslint:disable-next-line: no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
