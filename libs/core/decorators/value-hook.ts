const checkDescriptor = <T, K extends keyof T>(target: T, propertyKey: K) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

  if (descriptor && !descriptor.configurable) {
    throw new TypeError(`property ${propertyKey} is not configurable`);
  }

  return {
    oGetter: descriptor && descriptor.get,
    oSetter: descriptor && descriptor.set
  };
};

export type ValueHookSetter<T, K extends keyof T> = (key: symbol, value?: T[K]) => boolean | void;

export type ValueHookGetter<T, K extends keyof T> = (value: T[K]) => T[K];

/**
 * @description 劫持属性值
 * @param [setter]
 * @param [getter]
 * @returns
 * @example
 * ValueHook 回调函数里面导出函数 不然无法正确获取this和aot打包错误 建议封装成新的装饰器使用 如果封装参考  InputBoolean 和 InputNumber
 *
 * export function setHook(key, value) {
 *       // do something
 *       // 如果需要修改值需要返回false
 *       this[key] = value;
 *       return false;
 * }
 * export function getHook(value) {
 *      // do something
 *      // 需要返回的值
 *      return value
 * }
 * @Component({})
 * export class DemoComponent {
 *    @ValueHook(setHook, getHook)
 *    @Input()
 *    name: string;
 * }
 */
export function ValueHook<T, K extends keyof T>(setter?: ValueHookSetter<T, K>, getter?: ValueHookGetter<T, K>) {
  return (target: T, propertyKey: K) => {
    const { oGetter, oSetter } = checkDescriptor(target, propertyKey);

    const symbol = `_$$_${propertyKey}`;

    type Mixed = T & {
      symbol: T[K];
    };

    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      configurable: true,
      get(this: Mixed) {
        return getter && this[symbol] !== undefined ? getter.call(this, this[symbol]) : oGetter ? oGetter.call(this) : this[symbol];
      },
      set(this: Mixed, value: T[K]) {
        if (value === this[propertyKey] || (setter && setter.call(this, symbol, value) === false)) {
          return;
        }
        if (oSetter) {
          oSetter.call(this, symbol, value);
        }
        this[symbol] = value;
      }
    });
  };
}
