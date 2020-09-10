import { SafeAny } from '@ngx-simple/core/types';

const objectProto = Object.prototype;

export function isPrototype(value: SafeAny) {
  const Ctor = value && value.constructor,
    proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}
