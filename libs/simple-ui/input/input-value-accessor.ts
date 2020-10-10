import { InjectionToken } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';

/**
 * 此令牌用于注入应该将其值设置为'SimInput'的对象。如果提供，则使用本机'HTMLInputElement'。
 * 像'SimDatepickerInput'这样的指令可以提供为了让'SimInput'将值的获取和设置委托给它们。
 */
export const SIM_INPUT_VALUE_ACCESSOR = new InjectionToken<{ value: SafeAny }>('SIM_INPUT_VALUE_ACCESSOR');
