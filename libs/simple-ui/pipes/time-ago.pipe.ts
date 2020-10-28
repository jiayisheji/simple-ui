import { Inject, InjectionToken, Optional, Pipe, PipeTransform } from '@angular/core';
import { isDate, SimDateAdapter, toDate } from '@ngx-simple/core/datetime';

type Mapper = Array<{ single: string; many: string; div: number }>;

/** 用于配置simTimeAgo默认 */
export interface SimTimeAgoConfig {
  // 格式化映射 single 单个 many 多个 div 映射值
  mapper?: Mapper;
  // many后缀
  suffix?: string;
  // 刚刚
  just?: string;
  // 未来时间格式化 参考angular DatePipe
  format?: string;
}

export const SIM_TIME_AGO_CONFIG = new InjectionToken<SimTimeAgoConfig>('SIM_TIME_AGO_CONFIG');

const MAPPER: Mapper = [
  { single: '去年', many: '年', div: 1 },
  { single: '上个月', many: '月', div: 12 },
  { single: '上周', many: '周', div: 4 },
  { single: '昨天', many: '天', div: 7 },
  { single: '1小时前', many: '小时', div: 24 },
  { single: '刚刚', many: '分钟', div: 60 }
];

/**
 * 相对时间
 * - 1 分钟以内的时间 => 刚刚
 * - 1 小时以内的时间 => N 分钟前
 * - 24 小时以内的时间 => N 小时前
 * - 24 小时以外的时间 => 用 mm-dd HH:mm 的形式表示，即 12-08 08:00
 * -> 超过一年的时间 => 用 yyyy-mm-dd HH:mm 的形式表示，即 2019-12-08 08:00
 *
 */
@Pipe({ name: 'timeAgo' })
export class SimTimeAgoPipe implements PipeTransform {
  private YEAR_MS: number = 1000 * 60 * 60 * 24 * 7 * 4 * 12;
  private MAPPER: Mapper = MAPPER;
  private suffix: string = '前';
  private just: string = '刚刚';
  private format: string = 'yyyy-MM-dd HH:mm:ss';
  constructor(private dateAdapter: SimDateAdapter<Date>, @Optional() @Inject(SIM_TIME_AGO_CONFIG) config?: SimTimeAgoConfig) {
    if (config) {
      this.MAPPER = config.mapper || MAPPER;
      this.suffix = config.suffix || '前';
      this.just = config.just || '刚刚';
      this.format = config.format || 'yyyy-MM-dd HH:mm:ss';
    }
  }

  transform(value: null | undefined): null;
  transform(value: string | number | Date): string;
  transform(value: null | undefined | string | number | Date): string {
    // 处理异常情况
    if (value == null || value === '' || value !== value) {
      return null;
    }

    // 尝试解析值为日期对象
    const date = toDate(value);
    if (!isDate(date)) {
      return null;
    }

    const past = date.getTime();
    const now = +new Date();

    // 如果大于当前时间 使用DatePipe格式化
    if (past > now) {
      return this.dateAdapter.format(date, this.format);
    }

    for (let i = 0, l = this.MAPPER.length, ms = now - past, div = this.YEAR_MS; i < l; ++i) {
      const elm = this.MAPPER[i];
      const unit = Math.floor(ms / (div /= elm.div));

      if (unit >= 1) {
        return unit === 1 ? elm.single : `${unit}${elm.many}${this.suffix}`;
      }
    }

    // 当前时间小于1分钟
    return this.just;
  }
}
