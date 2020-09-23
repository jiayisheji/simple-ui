import { SafeAny } from '@ngx-simple/core/types';

/**
 * 命名方式（例如，long='星期日'，short='周日'，narrow='日'）
 * - long 长的
 * - short 短的
 * - narrow 更短的
 */
export type SimDateStyleName = 'long' | 'short' | 'narrow';

export abstract class SimDateAdapter<D> {
  /**
   * 将给定的天数添加到日期。
   * @param date 要添加天数的日期
   * @param days 要添加的天数（可以为负数）
   */
  abstract addDays(date: D, days: number): D;

  /**
   * 将给定的月数添加到日期。
   * 月份的计算方式就像在每个月的日历上翻动一页，然后在新月份中找到最接近的日期。
   * 例如，当将1个月添加到2017年1月31日时，结果日期将是2017年2月28日。
   * @param date 要添加月份的日期
   * @param months 要添加的月数（可以为负数）
   */
  abstract addMonths(date: D, months: number): D;

  /**
   * 将给定的年数加上日期。
   * 年份被计算为好像每年翻转日历上的12月，然后在新月份中找到最接近的日期。
   * 例如，当将1年添加到2016年2月29日时，结果日期将是2017年2月28日。
   * @param date 要添加年份的日期
   * @param years 要增加的年数(可以为负数)
   * @returns 一个新的日期，等于给定的日期加上指定的年数。
   */
  abstract addYears(date: D, years: number): D;

  /**
   * 将给定日期限制在最小日期和最大日期之间
   * @param date 要确定的日期
   * @param min 允许的最小值。如果为空或省略，则不执行最小值
   * @param max 允许的最大值。如果为空或省略，则不执行最大值
   * @returns 如果`date`小于`min`，则为`min`；如果`date`大于`max`，则为`max`，否则为`date`。
   */
  abstract clampDate(date: D, min?: D | null, max?: D | null): D;

  /**
   * 将给定日期限制在最小日期时间和最大日期之间时间
   * @param date 要确定的日期时间
   * @param min 允许的最小值。如果为空或省略，则不执行最小值
   * @param max 允许的最大值。如果为空或省略，则不执行最大值
   * @returns 如果`date`小于`min`，则为`min`；如果`date`大于`max`，则为`max`，否则为`date`。
   */
  abstract clampDatetime(date: D, min?: D | null, max?: D | null): D;

  /**
   * 克隆给定的日期
   * @param date 克隆日期
   * @returns 等于给定日期的新日期
   */
  abstract clone(date: D): D;

  /**
   * 比较两个日期
   * @param first 比较的第一个日期
   * @param second 比较的第二个日期
   * @returns 如果日期相等，则为0；如果第一个日期较早，则小于0；如果第一个日期较晚，则大于0。
   */
  abstract compareDate(first: D, second: D): number;

  /**
   * 比较两个日期时间
   * @param first 比较的第一个日期时间
   * @param second 比较的第二个日期时间
   * @returns 如果日期时间相等，则为0；如果第一个日期时间较早，则小于0；如果第一个日期时间较晚，则大于0。
   */
  abstract compareDatetime(first: D, second: D): number;

  /**
   * 使用给定的年，月，日，时，分，秒，毫秒创建日期
   * @param year 日期的整年 yyyy（例如89表示89年，而不是1989年）。
   * @param month 日期的月份。必须是一个整数0 ~ 11。
   * @param date 日期的月份的日期。必须是一个整数1 ~ 指定月份最后一天
   * @param hours 日期的一天小时。必须是一个整数0 ~ 23
   * @param minutes 日期的一小时的分钟。必须是一个整数0 ~ 59
   * @param seconds 日期的一分钟的秒钟。必须是一个整数0 ~ 59
   * @param milliseconds 日期的一秒钟的毫秒数。必须是一个整数0 ~ 999
   */
  abstract createDate(
    year: number,
    month: number,
    date: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number
  ): D;

  /**
   * 尝试将值反序列化为有效的日期对象。
   * 这与解析的不同之处在于，反序列化应仅接受无歧义，与语言环境无关的格式（例如ISO 8601字符串）。
   * 默认实现不允许任何反序列化，它只是检查给定的值是否已经是有效的日期对象或null。
   * @param value 要反序列化为日期对象的值
   * @returns 反序列化日期对象，可以是有效日期，如果可以将该值反序列化为空日期（例如，空字符串），则为null或无效日期。
   */
  deserialize(value: SafeAny): D | null {
    if (value == null || (this.isDateInstance(value) && this.isValid(value))) {
      return value;
    }
    return this.invalid();
  }

  /**
   * 根据给定的格式将日期格式化为字符串
   * @param date 给定日期
   * @param displayFormat 用于将日期显示为字符串的格式 默认yyyy-MM-dd
   * @returns 格式化的日期字符串
   */
  abstract format(date: D, displayFormat?: string): string;

  /**
   * 获取给定日期的月份的日期
   * @param date 给定日期
   * @returns 从1开始 => 每月第一天
   */
  abstract getDate(date: D): number;

  /**
   * 获取给定日期的星期几 和 getDay() 方法有区别
   * @param date 要从中提取星期几的日期
   * @returns 取决于getFirstDayOfWeek方法getFirstDayOfWeek => 0 如果 1星期一 0星期日 getFirstDayOfWeek => 1 如果 0星期一 6星期日
   */
  abstract getDayOfWeek(date: D): number;

  /**
   * 获取一周中各天的名称列表
   * @param style 命名方式（例如，long='星期日'，short='周日'，narrow='日'）。
   * @returns 从星期天开始的所有工作日名称的有序列表
   */
  abstract getDayOfWeekNames(style: SimDateStyleName): string[];

  /**
   * 获取一周的第一天
   * @returns 一周的第一天（0索引，0 =星期日）（1索引，0 =星期一）
   */
  abstract getFirstDayOfWeek(): number;

  /**
   * 获取给定日期的月份中第一天的星期几
   * @param date 应该检查其月份的日期
   * @returns 给定日期的月份中第一天的星期几
   */
  abstract getFirstDayOfWeekInMonth(data: D): number;
  /**
   * 获取给定日期的一天的小时
   * @param date 给定日期
   * @returns 从0开始 => 每天第一小时
   */
  abstract getHours(date: D): number;
  /**
   * 获取给定日期的小时的分钟
   * @param date 给定日期
   * @returns 从0开始 => 每小时第一分钟
   */
  abstract getMinutes(date: D): number;

  /**
   * 获取给定日期的月份
   * @param date 给定日期
   * @returns 从0开始 => 每年第一个月
   */
  abstract getMonth(date: D): number;

  /**
   * 获取月份的名称列表
   * @param style 命名方式（例如，long='一月'，short='1月'，narrow='一'）。
   * @returns 从一月开始的所有月份名称的有序列表。
   */
  abstract getMonthNames(style: SimDateStyleName): string[];

  /**
   * 获取给定日期的月份中的天数
   * @param date 应该检查其月份的日期
   * @returns 给定日期的月份中的天数
   */
  abstract getNumDaysInMonth(date: D): number;

  /**
   * 获取给定日期的年份中的第几周
   * @param date 应该检查其年份的日期
   * @returns 给定日期的年份中的周数
   */
  abstract getNumWeekInYear(date: D): number;
  /**
   * 获取给定日期的分钟的秒钟
   * @param date 给定日期
   * @returns 从0开始 => 每分钟第一秒钟
   */
  abstract getSeconds(date: D): number;

  /**
   * 给定一个潜在的日期对象，如果存在则返回相同的有效日期，如果不是有效日期，则为null。
   * @param obj 要检查的对象
   * @returns 返回有效日期或null
   */
  getValidDateOrNull(obj: unknown): D | null {
    return this.isDateInstance(obj) && this.isValid(obj as D) ? (obj as D) : null;
  }

  /**
   * 取给定日期的年份
   * @param date 给定日期
   * @returns 年份 yyyy
   */
  abstract getYear(date: D): number;

  /**
   * 获取无效的日期实例
   * @returns 无效的日期
   */
  abstract invalid(): D;

  /**
   * 检查此DateAdapter是否将给定对象视为日期实例
   * @param obj 要检查的对象
   * @returns 对象是否为日期实例
   */
  abstract isDateInstance(obj: SafeAny): obj is D;

  /**
   * 检查给定日期是否有效
   * @param date 给定日期
   * @returns 日期是否有效
   */
  abstract isValid(date: D): boolean;

  /**
   * 根据用户提供的值解析日期
   * @param value 要解析的值
   * @returns 解析的日期
   */
  abstract parse(value: string | number | D): D | null;

  /**
   * 检查两个日期是否相等
   * @param first 检查的第一次日期
   * @param second 检查的第二次日期
   * @returns 两个日期是否相等。空日期被认为等于其他空日期
   */
  abstract sameDate(first: D, second: D): boolean;

  /**
   * 检查两个日期时间是否相等
   * @param first 检查的第一次日期时间
   * @param second 检查的第二次日期时间
   * @returns 两个日期时间是否相等。空日期时间被认为等于其他空日期时间
   */
  abstract sameDatetime(first: D, second: D): boolean;

  /**
   * 获取给定日期的 RFC 3339 (https://tools.ietf.org/html/rfc3339) 兼容字符串
   * @param date 获取ISO日期字符串的日期
   * @returns ISO日期字符串日期字符串
   */
  abstract toIso8601(date: D): string;

  /**
   * 获取今天的日期
   * @returns 今天的日期
   */
  abstract today(): D;
}
