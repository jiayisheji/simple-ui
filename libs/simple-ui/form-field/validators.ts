import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * 这里我们不检查字符串，所以它也能处理数组
 * @param value
 * @returns boolean
 */
export function isEmptyInputValue(value: null | undefined | string): boolean {
  return value == null || value.length === 0;
}

/**
 * 非严格比较是有意的，用于检查“null”和“undefined”值
 * @param value
 * @returns boolean
 */
export function hasValidLength(value: null | undefined | string): boolean {
  return value != null && typeof value.length === 'number';
}

/**
 * 正则表达式
 */
export const regex = {
  // 中文
  CHINESE: /^[\u4e00-\u9fa5]$/,
  // url
  URL: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/m,
  // ip
  IP: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
};

export class SimValidators {
  /**
   * @description 如果是输入字符串 input:text
   * @param control
   * @returns ValidationErrors | null
   */
  static requiredInput(control: AbstractControl): ValidationErrors | null {
    return isEmptyInputValue(control.value) || control.value.trim().length === 0 ? { required: true } : null;
  }

  /**
   * @description 比较2个值相等
   * @param compare
   * @returns ValidationErrors | null
   */
  static equal(compare: AbstractControl): ValidatorFn {
    function validatorFn(control: AbstractControl): ValidationErrors | null {
      if (isEmptyInputValue(control.value)) {
        return null;
      }
      return control.value === compare.value ? null : { equal: true };
    }
    return validatorFn;
  }

  /**
   * @description 比较2个值不相等
   * @param compare
   * @returns ValidationErrors | null
   */
  static notEqual(compare: AbstractControl): ValidatorFn {
    function validatorFn(control: AbstractControl): ValidationErrors | null {
      return !SimValidators.equal(compare.value)(control.value) ? null : { notEqual: true };
    }
    return validatorFn;
  }

  /**
   * @description 验证url
   * @param control
   * @returns {(ValidationErrors | null)}
   * @memberof SimValidators
   */
  static url(control: AbstractControl): ValidationErrors | null {
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return regex.URL.test(control.value) ? null : { url: true };
  }

  /**
   * @description 验证ip
   * @param control
   * @returns {(ValidationErrors | null)}
   * @memberof SimValidators
   */
  static ip(control: AbstractControl): ValidationErrors | null {
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return regex.IP.test(control.value) ? null : { ip: true };
  }

  /**
   * @description 检查数字是否在指定范围内
   * @param {number} min
   * @param {number} max
   * @returns ValidationErrors | null
   */
  static range(min: number, max: number): ValidatorFn {
    function validatorFn(control: AbstractControl): ValidationErrors | null {
      const value = parseFloat(control.value);
      return !isNaN(value) && length < max && length > min
        ? null
        : {
            range: { requiredRange: [min, max], actual: control.value }
          };
    }
    return validatorFn;
  }

  /**
   * @description 检查字符串的长度是否在指定范围内
   * @param {number} minLength
   * @param {number} maxLength
   * @returns ValidationErrors | null
   */
  static rangeLength(minLength: number, maxLength: number): ValidatorFn {
    function validatorFn(control: AbstractControl): ValidationErrors | null {
      if (isEmptyInputValue(control.value)) {
        return null;
      }
      const length: number = control.value.length;
      return length < maxLength && length > minLength
        ? null
        : {
            rangeLength: {
              requiredRangeLength: [minLength, maxLength],
              actualLength: length
            }
          };
    }
    return validatorFn;
  }

  /**
   * @description 检查是否是中文，并且长度是否在指定范围内
   * @param {number} minLength
   * @param {number} maxLength
   * @returns ValidationErrors | null
   */
  static chineseLength(minLength: number, maxLength: number): ValidatorFn {
    function validatorFn(control: AbstractControl): ValidationErrors | null {
      if (isEmptyInputValue(control.value)) {
        return null;
      }
      const length: number = control.value.length;
      // 如果不是中文直接返回
      if (!regex.CHINESE.test(control.value)) {
        return {
          chinese: true
        };
      }
      // 判断是否在指定长度内
      return length < maxLength && length > minLength
        ? null
        : {
            chineseLength: {
              requiredChineseLength: [minLength, maxLength],
              actualLength: length
            }
          };
    }
    return validatorFn;
  }

  /**
   * @description 检查字符长度区分中英文，长度是否在指定范围内 一个中文算2个字符
   * @param {number} minLength
   * @param {number} maxLength
   * @returns ValidationErrors | null
   */
  static charLength(minLength: number, maxLength: number): ValidatorFn {
    const CHINESE_REGEX = new RegExp(regex.CHINESE, 'g');
    function validatorFn(control: AbstractControl): ValidationErrors | null {
      if (isEmptyInputValue(control.value)) {
        return null;
      }
      const value = control.value.replace(CHINESE_REGEX, '**');
      const length: number = value.length;

      // 判断是否在指定长度内
      return length < maxLength && length > minLength
        ? null
        : {
            charLength: {
              requiredCharLength: [minLength, maxLength],
              actualLength: length
            }
          };
    }
    return validatorFn;
  }
}
