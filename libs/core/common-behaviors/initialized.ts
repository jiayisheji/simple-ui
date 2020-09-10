import { SafeAny } from '@ngx-simple/core/types';
import { Observable, Subscriber } from 'rxjs';
import { Constructor } from './constructor';

/**
 * Mixin将一个初始化的属性添加到指令中，
 * 当订阅该指令时，一旦调用了markInitialized，
 * 该指令就会发出一个值，这应该在ngOnInit函数期间完成。
 * 如果订阅是在它已经被标记为初始化之后进行的，那么它将立即触发一个emit。
 */
export interface HasInitialized {
  /** 在指令/组件的ngOnInit期间发出一次的流。 */
  initialized: Observable<void>;
  /**
   * 将状态设置为已初始化，并且必须在ngOnInit期间调用，以通知订阅方指令已初始化。
   */
  markInitialized: () => void;
}

export type HasInitializedCtor = Constructor<HasInitialized>;

/** Mixin:用一个initialize的属性来扩充指令，这个属性将在ngOnInit结束时发出。 */
export function mixinInitialized<T extends Constructor<{}>>(base: T): HasInitializedCtor & T {
  return class extends base {
    /** 这个指令是否被标记为已初始化。 */
    _isInitialized = false;

    /**
     * 在指令初始化之前订阅的订阅者列表。
     * 应该在markInitialized过程中被通知。
     * 在通知挂起的订阅服务器后将其设置为null，并且不应该期望在之后填充它。
     */
    _pendingSubscribers: Array<Subscriber<void>> | null = [];

    /**
     * 当指令初始化时发出的可观察的流。如果已经初始化，则在调用markInitialized时通知订阅服务器。
     */
    initialized = new Observable<void>(subscriber => {
      // 如果初始化，立即通知订阅服务器。否则，存储订阅服务器以在调用markInitialized时通知。
      if (this._isInitialized) {
        this._notifySubscriber(subscriber);
      } else {
        this._pendingSubscribers.push(subscriber);
      }
    });

    constructor(...args: SafeAny[]) {
      super(...args);
    }

    /** 发出并完成订阅流(应该只发出一次) */
    _notifySubscriber(subscriber: Subscriber<void>): void {
      subscriber.next();
      subscriber.complete();
    }

    /**
     * 将状态标记为已初始化，并通知挂起的订阅服务器。应该在ngOnInit结束时调用。
     */
    markInitialized(): void {
      if (this._isInitialized) {
        throw Error('This directive has already been marked as initialized and should not be called twice.');
      }

      this._isInitialized = true;

      this._pendingSubscribers.forEach(this._notifySubscriber);
      this._pendingSubscribers = null;
    }
  };
}
