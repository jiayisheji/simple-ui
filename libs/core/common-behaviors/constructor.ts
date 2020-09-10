import { SafeAny } from '@ngx-simple/core/types';

export type Constructor<T> = new (...args: SafeAny[]) => T;
