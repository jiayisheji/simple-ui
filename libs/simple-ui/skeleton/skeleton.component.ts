import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { InputBoolean } from '@ngx-simple/simple-ui/core/decorators';
import { isArray } from '@ngx-simple/simple-ui/core/typeof';
import { NgStyleInterface } from '@ngx-simple/simple-ui/core/types';

export interface SimSkeletonCol {
  // 24栅格布局，列占的宽度
  span?: number;
  // 	宽度
  width?: string;
  // 高度
  height?: string;
  // 列类型
  type?: 'bar' | 'avatar' | 'img' | 'empty';
  // 子集
  rows?: SimSkeletonRow[];
  // 样式
  style?: NgStyleInterface;
}

export interface SimSkeletonRow {
  // 列
  cols: SimSkeletonCol[];
  // 列间距
  space?: number;
  // 外边距
  margin?: string;
  // 样式
  style?: NgStyleInterface;
}

const span = 100 / 24;
const gutter = 8;

@Component({
  selector: 'sim-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-skeleton'
  }
})
export class SimSkeletonComponent implements OnInit {
  // 是否加载中
  @Input()
  @InputBoolean<SimSkeletonComponent, 'loading'>()
  loading: boolean;

  // 是否使用动画
  @Input()
  @InputBoolean<SimSkeletonComponent, 'animate'>()
  @HostBinding('class.sim-skeleton-animate')
  animate: boolean;

  @Input()
  data: SimSkeletonRow[];

  _skeletons: SimSkeletonRow[];

  constructor() {}

  ngOnInit(): void {
    this._skeletons = this.dataToSkeleton(this.data);
  }

  private dataToSkeleton(data: SimSkeletonRow[]) {
    if (!isArray(data) || !data.length) {
      return [];
    }
    return data.map((row: SimSkeletonRow) => {
      if (!row.style) {
        row.style = {};
      }
      row.style['margin'] = row.margin || `${gutter}px -${gutter}px`;

      const space = row.space || 1;

      row.cols.map((col: SimSkeletonCol) => {
        let margin = `0 ${gutter * space}px`;

        if (col.rows) {
          col.rows = this.dataToSkeleton(col.rows);
          margin = `-${gutter}px ${gutter * space}px`;
        }

        // 如果设了span 宽度以span为主
        if (col.span) {
          col.width = span * col.span + '%';
        }

        if (!col.style) {
          col.style = {};
        }
        // 如果没有宽度，默认就是100%
        col.style['width'] = col.width || '100%';
        col.style['margin'] = margin;
        col.style['height'] = col.height;
        // 如果宽度不是百分比，需要强制写个最小宽度
        if (col.width && !col.width.endsWith('%')) {
          col.style['min-width'] = col.width;
        }
        return col;
      });
      return row;
    });
  }
}

@Component({
  selector: 'sim-skeleton-content',
  templateUrl: './skeleton-content.component.html',
  styleUrls: ['./skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-skeleton-content'
  }
})
export class SimSkeletonContentComponent {
  @Input()
  data: SimSkeletonRow[];

  trackByFn(index: number, item: SimSkeletonRow | SimSkeletonCol) {
    return index;
  }
}
