import { SafeAny } from '@ngx-simple/core/types';

/** @docs-private */
export type Constructor<T> = new (...args: SafeAny[]) => T;

/**
 * 这是一个允许抽象类构造函数的类型
 * @docs-private
 */
export type AbstractConstructor<T> = Function & { prototype: T };
