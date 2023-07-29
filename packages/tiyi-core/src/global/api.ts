// noinspection JSUnusedGlobalSymbols

import {cache} from "./cache"
import {TiAppCacheSpace} from "types";
import {TIYI} from "@/global/instance";
import {MicroApp} from "@/interface";

/** 获取所有app的缓存 */
export function getAppCaches<MergeCacheType>(): Record<string, TiAppCacheSpace<MergeCacheType>> {
  return cache.appCaches
}


/** 参数1:app名字，只有一个参数返回所有字段; 参数2:字段名，返回该app缓存下的某个字段*/
export function getAppCache<MergeCacheType, T extends TiAppCacheSpace<MergeCacheType>, Field extends keyof T>(name: string): T;
export function getAppCache<MergeCacheType, T extends TiAppCacheSpace<MergeCacheType>, Field extends keyof T>(name: string, field: Field): T[Field];
export function getAppCache<MergeCacheType, T extends TiAppCacheSpace<MergeCacheType>, Field extends keyof T>(name: string, field?: Field): T | T[Field] {
  return field ? (cache.appCaches[name] || {})[field] : cache.appCaches[name] || {}
}

/** 设置app缓存，不建议普通开发者使用，除非你明知外部设置的数据不会覆盖缓存,且每次app销毁的时候移除对应缓存 */
export function setAppCache<MergeCacheType, Name extends keyof TiAppCacheSpace<MergeCacheType>>(
  name: string,
  data: Partial<Record<keyof TiAppCacheSpace<MergeCacheType>, TiAppCacheSpace<MergeCacheType>[Name]>> & Record<string, any>
): void {
  cache.appCaches[name] ? Object.assign(cache.appCaches[name], data) : cache.appCaches[name] = data
}

/** 获取所有的微应用 */
export function getMicroApps(): Record<string, MicroApp | undefined> {
  return cache.apps
}
/** 获取微应用 */
export function getMicroApp(name: string): MicroApp | undefined {
  return cache.apps[name]
}

export function setMicroApp(name: string, app: MicroApp): void {
  cache.apps[name] = app
}


/** 定义一个微应用 */
export function createMicroApp(): MicroApp {   // 支持传入一个自定义微应用构造器来来作为微应用基石，如果没传入默认使用MicroApp，
  if (!TIYI._running_) {
    TIYI._running_ = true
    TIYI.executeHook('ready')
  }
  // 如果开发者没有进行定义baseApp直接定义微应用，则先手动创造baseApp
  const app = new MicroApp()
  TIYI.executeHook('createMicroApp', app)   // 有运行就通知各插件，可用于插件监听并修改插件新配置
  return app
}
