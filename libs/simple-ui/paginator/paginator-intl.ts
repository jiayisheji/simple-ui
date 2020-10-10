import { Injectable, Optional, SkipSelf } from '@angular/core';

/**
 * 要修改显示的标签和文本
 */
@Injectable({ providedIn: 'root' })
export class SimPaginatorIntl {
  /** 增加当前页面的按钮文本 Next page */
  nextPageLabel: string = '下一页';

  /** 减少当前页面的按钮文本 Previous page */
  previousPageLabel: string = '上一页';

  /** 当前页面增加的按钮文本 Increase five page */
  increaseFivePageLabel: string = '向后 5 页';

  /** 当前页面减少5页的按钮文本 Decrease five page */
  decreaseFivePageLabel: string = '向前 5 页';

  /** 移动到第一页的按钮文本 First page */
  firstPageLabel: string = '首页';

  /** 移动到最后一页的按钮文本 Last page */
  lastPageLabel: string = '尾页';

  /**
   * 用于当前页内项范围和整个列表长度的标签
   * page: 从1开始
   */
  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 1 || pageSize === 0) {
      return `1 of ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = (page - 1) * pageSize;

    // 如果起始索引超过列表长度，不要尝试将结束索引固定到末尾。
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} of ${length}`;
  };
}

export function SIM_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl: SimPaginatorIntl) {
  return parentIntl || new SimPaginatorIntl();
}

export const SIM_PAGINATOR_INTL_PROVIDER = {
  // 如果已经有可用的SimPaginatorIntl，请使用它。否则，提供一个新的。
  provide: SimPaginatorIntl,
  deps: [[new Optional(), new SkipSelf(), SimPaginatorIntl]],
  useFactory: SIM_PAGINATOR_INTL_PROVIDER_FACTORY
};
