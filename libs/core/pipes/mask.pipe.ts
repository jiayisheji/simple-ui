import { Pipe, PipeTransform } from '@angular/core';
import { isNumber, isString } from '@ngx-simple/core/typeof';

type PartialMask = 'name' | 'mobile' | 'email' | 'ID' | 'bank';
type LevelMask = 'high' | 'medium' | 'low';
/**
 * 数据脱敏是指对某些敏感信息通过脱敏规则进行数据变形，实现敏感隐私数据的可靠保护。
 * - 全部脱敏：一般用于金额、时间等特别重要敏感的信息，需要对所有数字进行脱敏。
 * - 部分脱敏：一般用于需要部分信息进行识别的状况，只需要对部分信息进行脱敏处理，但数字真实位数保留。
 *  - name: 两个字的姓名：显示第一个字符，其余「*」表示；三个字及三个字以上的姓名：显示第一个字符和最后一个字符，其余「*」表示；英文名同理
 *  - mobile：保留手机号码前 3 位与后 4 位
 *  - email: 保留邮箱主机名与前三位字符，其余「*」表示。
 *  - ID：公民身份号码由六位地址码，八位出生日期码，三位顺序码和一位校验码组成。
 *    - 高级：保留前一位与后一位，其余「*」表示，仅能识别该人属于哪个地区。
 *    - 中级：保留前三位与后三位，其余「*」表示，仅能识别该人的省市与是男是女。
 *    - 低级：保留前六位与后四位，其余「*」表示，仅能识别该人的省市区与是男是女。
 *  - bank: 银行卡号码由发卡行标识代码（六到十二位不等），个人账号标识（六到十二位不等），一位校验码组成。
 *    - 高级：保留后四位，其余「*」表示，仅能识别部份个人账号标识。
 *    - 中级：保留前六位与后位，其余「*」表示，仅能识别发卡行与小部份个人账号标识。
 *    - 低级：保留前四位与后六位，其余「*」表示。仅能识别发卡行与大部份个人账号标识。
 *
 * @example
 * {{ '仲康' | mask: 'name' }}
 * 仲*
 *
 * {{ '许仲康' | mask: 'name' }}
 * 许*康
 *
 * {{ '13412345678' | mask: 'mobile' }}
 * 134****5678
 *
 * {{ '12345678@163.com' | mask: 'email' }}
 * 123*****@163.com
 *
 * {{ '自定义数据脱敏' | mask: 1 }}
 * 自******
 *
 * {{ '自定义数据脱敏' | mask: 1 : 5 }}
 * 自*****敏
 */
@Pipe({
  name: 'mask'
})
export class SimMaskPipe implements PipeTransform {
  private readonly _shield = '*';
  transform(value: null | undefined): null;
  transform(value: string, partialMask: PartialMask, levelMask?: LevelMask): string;
  transform(value: string, partialMask: number, levelMask?: number): string;
  transform(value: string, partialMask?: number | PartialMask, levelMask?: number | LevelMask): string {
    // 处理异常情况
    if (this.invalid(value)) {
      return null;
    }
    // 保证字符串字符串 只处理字符串和数字
    if (!(isString(value) || isNumber(value))) {
      return value;
    }
    // 强制转换成字符串
    value = value + '';

    // 如果没有提供部分脱敏，我们默认为是全部脱敏
    if (this.invalid(partialMask) || partialMask === 0) {
      return this.complete(value);
    }

    // 如果长度只有1，直接返回。
    if (value.length === 1) {
      return value;
    }
    // 处理部分脱敏
    return this.partial(value, partialMask as number | PartialMask, levelMask);
  }

  private invalid(value: string | number | null | undefined): value is null | undefined {
    return value == null || value === '' || value !== value;
  }

  private complete(value: string): string {
    return this.fill(value.length);
  }

  private partial(value: string, partialMask: number | PartialMask, levelMask?: number | LevelMask) {
    // 如果提供是数字，我们有理由详细是自定义部分脱敏位置
    if (isNumber(partialMask)) {
      return this.customize(value, partialMask, levelMask);
    }
    // 处理我们关键字
    switch (partialMask) {
      case 'name':
        if (value.length === 2) {
          return value.replace(/(\w{1})\w{1}/, '$1*');
        }
        return value.replace(/(\w{1})(.*)(\w{1})/, this.replaceFill.bind(this));
      case 'email':
        return value.replace(/(\w{3})(.*)(@\w+)/, this.replaceFill.bind(this));
      case 'mobile':
        return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      default:
        throw new Error(`mask nonsupport ${partialMask} keyword`);
    }
  }

  private customize(value: string, partialMask: number, levelMask?: number | LevelMask) {
    // 如果提供不是数字我们有理由忽略它 直接从起始位置到结束
    if (!isNumber(levelMask)) {
      levelMask = value.length;
    }
    // 如果结束值小于开始值，需要交互一下，放置出现bug
    if (levelMask < partialMask) {
      [partialMask, levelMask] = [levelMask, partialMask];
    }
    const district = new RegExp(`(\w{${partialMask}})(\w{${levelMask}})(.*)`);
    return value.replace(district, this.replaceFill.bind(this));
  }

  private replaceFill(...args: string[]): string {
    return `${args[1]}${this.fill(args[2].length)}${args[3]}`;
  }

  private fill(length: number): string {
    return new Array(length + 1).join(this._shield);
  }
}
