import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { isFunction } from '@ngx-simple/core/typeof';
import { EMPTY } from 'rxjs';
import { SimNprogressDefaultOptions } from './nprogress-config';
import { SimNprogressRef } from './nprogress-ref';

/**
 * 注入令牌，可用于配置应用程序中所有页面顶部加载进度条的默认选项。
 */
export const SIM_NPROGRESS_DEFAULT_OPTIONS = new InjectionToken<SimNprogressDefaultOptions>('SIM_NPROGRESS_DEFAULT_OPTIONS');

@Injectable({
  providedIn: 'root'
})
export class SimNprogressService {
  /** 全局配置 */
  config: SimNprogressDefaultOptions;

  /** 存储ProgressBarRef实例 */
  private readonly _instances = {};

  constructor(@Optional() @Inject(SIM_NPROGRESS_DEFAULT_OPTIONS) config: SimNprogressDefaultOptions) {
    this.config = { ...new SimNprogressDefaultOptions(), ...config };
    if (!isFunction(this.config.trickleFunc)) {
      this.config.trickleFunc = (n: number): number => {
        if (n >= 0 && n < 20) {
          return 10;
        }
        if (n >= 20 && n < 50) {
          return 4;
        }
        if (n >= 50 && n < 80) {
          return 2;
        }
        if (n >= 80 && n < 99) {
          return 0.5;
        }
        return 0;
      };
    }
  }

  /**
   * 根据id返回ProgressBarRef
   * @param id 自定义标识 默认root
   * @param config 配置
   */
  ref(id = 'root', config?: SimNprogressDefaultOptions) {
    if (this._instances[id] instanceof SimNprogressRef) {
      return this._instances[id];
    } else {
      config = { ...this.config, ...config };
      return (this._instances[id] = new SimNprogressRef(config));
    }
  }

  /**
   * 给指定的实例设置配置
   * @param config 配置
   * @param id 自定义标识 默认root
   */
  setConfig(config: SimNprogressDefaultOptions, id = 'root') {
    if (this._instances[id] instanceof SimNprogressRef) {
      this._instances[id].setConfig(config);
    }
  }
  /**
   * 启动指定标识
   * @param id 自定义标识 默认root
   */
  start(id = 'root') {
    if (this._instances[id] instanceof SimNprogressRef) {
      this._instances[id].start();
    }
  }

  set(n: number, id = 'root') {
    if (this._instances[id] instanceof SimNprogressRef) {
      this._instances[id].set(n);
    }
  }

  inc(n?: number, id = 'root') {
    if (this._instances[id] instanceof SimNprogressRef) {
      this._instances[id].inc(n);
    }
  }

  complete(id = 'root') {
    if (this._instances[id] instanceof SimNprogressRef) {
      this._instances[id].complete();
    }
  }

  isStarted(id = 'root') {
    return this._instances[id] instanceof SimNprogressRef ? this._instances[id].isStarted : false;
  }

  started(id = 'root') {
    return this._instances[id] instanceof SimNprogressRef ? this._instances[id].started : EMPTY;
  }

  completed(id = 'root') {
    return this._instances[id] instanceof SimNprogressRef ? this._instances[id].completed : EMPTY;
  }

  destroy(id = 'root') {
    if (this._instances[id] instanceof SimNprogressRef) {
      this._instances[id].destroy();
      this._instances[id] = null;
    }
  }

  destroyAll() {
    Object.keys(this._instances).forEach(key => {
      this._instances[key].destroy();
      this._instances[key] = null;
    });
  }
}
