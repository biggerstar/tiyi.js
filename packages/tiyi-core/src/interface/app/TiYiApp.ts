// noinspection JSUnusedGlobalSymbols

import {MicroApp, PluginManager, TiYiPlugin} from "@/interface";
import {DefaultAppCachesType} from "types";

/** TIYI 框架添加各种插件的支持入口 */
export class TiYiApp extends PluginManager<TiYiApp, TiYiPlugin> {
  static [Symbol.toStringTag] = 'TiYi'
  //@ts-ignore
  readonly _isTiYiApp_: boolean;
  public _running_ = false
  /**  所有当前运行的app */
  public apps: Record<string, MicroApp>;
  /** 所有当前app主动缓存的数据  */
  public appCache: Record<string, DefaultAppCachesType>

  constructor() {
    super()
    this.apps = {}
    this.appCache ={}
    Object.defineProperty(<object>this, '_isTiYiApp_', {  /*强制定义不可修改*/  value: true, configurable: false})
  }
}
