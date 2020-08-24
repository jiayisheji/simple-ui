import { SafeAny } from '@ngx-simple/simple-ui/core/types';

export type Constructor<T> = new (...args: SafeAny[]) => T;
