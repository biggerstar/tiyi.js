// noinspection JSUnusedGlobalSymbols

import {MicroApp, MicroAppPlugin, PluginEntry, TiYiApp, TiYiPlugin} from "@/interface";

/** app和对应插件类型的映射，可以支持外部declare module进行修改或新增 */
export type AppPluginMapping = {
  TiYiApp: {
    app: TiYiApp;
    plugin: TiYiPlugin
  };
  MicroApp: {
    app: MicroApp;
    plugin: MicroAppPlugin
  };
}
export type GenPluginType<App> = (App extends AllAppType ? ExtractPluginType<App> : PluginEntry<App>)
  | ((app: App, ...pluginConfig: any[]) => void)

export type GenPluginEntryType<App, Plugin = {}> = (
  ((app: App, ...pluginConfig: any[]) => void)
  | Plugin
  | (new(...args: any[]) => any)
  ) & PluginEntry<App>   // 每个class function object 对象中只要带有install函数就符合插件条件


export type Values<T> = T[keyof T];

export type AllAppType = Values<{ [K in keyof AppPluginMapping]: AppPluginMapping[K]['app'] }>

// /** 提取AppPluginMapping中的对应插件类型 */
// export type ExtractAppType<Plugin> = {
//   [Key in keyof AppPluginMapping]: Plugin extends AppPluginMapping[Key]['plugin'] ? AppPluginMapping[Key]['app'] : any;
// }[keyof AppPluginMapping]

/** 提取AppPluginMapping中的对应插件类型 */
export type ExtractPluginType<App> = {
  [Key in keyof AppPluginMapping]: App extends AppPluginMapping[Key]['app'] ? AppPluginMapping[Key]['plugin'] : never;
}[keyof AppPluginMapping]

/** 提取插件中所有符合插件命名规则的函数， on + CapitalizeName，最终会将该名称转成 uncapitalizeName */
export type ExtractTiPluginEventInputName<T> = NonNullable<Values<{
  [K in keyof NonNullable<T>]: K extends `on${infer Name}` ? Uncapitalize<Name> : never
}>>

export type AnyRecord = {
  [key: (string | number | symbol)]: any
}

export type CreateElementTagType = {
  el: HTMLElement;
  appendTo(baseEl: HTMLElement): CreateElementTagType;
  attr(k: string, v: any, isExec?: any): any;
  remove(removeBaseEl: HTMLElement): void;
}

export type DefaultAppCachesType = {
  /** app挂载点 */
  el: Element;
  /** app挂载点对应的iframe */
  iframe: HTMLIFrameElement;
  /** 内置插件管理器 */
  /** iframe的document */
  document: Document;
  /** iframe的window */
  window: Window;
}


export type GenHookScriptContentSupportFunctionType = {
  auto(type: GenHookScriptContentSupportType): string | Function,
  closure(): string,
  module(): string,
  with(): string,
  function(customEnvKeys: string[]): Function,
}

export type TiYiAppCaches = {
  apps: Partial<Record<string, MicroApp | undefined>>,
  appCaches: Partial<Record<(keyof DefaultAppCachesType) | string, any>>
}

export type TiEventTargetType<Target, Data = null> = {
  name: string
  target: Target,
  data: (Data extends null ? any : Data) | undefined
}

export type GenHookScriptContentSupportType = "auto" | 'module' | 'function' | 'closure' | 'with'

export type TiAppCacheSpace<MergeCacheType = {}> = DefaultAppCachesType & Record<string, any> & MergeCacheType



