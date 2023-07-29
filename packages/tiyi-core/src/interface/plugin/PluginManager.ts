// noinspection JSUnusedGlobalSymbols

import {capitalizeWords, isClass, isFunction} from "@/utils";
import {ExtractTiPluginEventInputName, GenPluginEntryType, TiEventTargetType} from "types";

/** plugin.priority 插件优先级，有定义的话插件按优先级排序，所没指定便不会进入队列排序直接安装 */
export class PluginManager<App, Plugin> {
  /** 所有已经安装的插件 */
  public _PLUGINS_: Array<GenPluginEntryType<App, Plugin>>

  constructor() {
    this._PLUGINS_ = []
  }

  /** 插件安装函数，安装入口为函数install,支持priority插件优先级
   * use 参数2后面传入的配置在install形参中接受到
   * 支持插件传入安装的方式:
   * 1.js类
   * 2.普通js对象
   * 3.一个纯函数
   * */
  public use(plugin: GenPluginEntryType<App, Plugin>, ...pluginConfig: any[]): this | App {
    // 如果插件已安装不会再安装， 后面可以 weakMap 优化，但是支持不好
    if (!this._PLUGINS_.find(pluginInfo => pluginInfo === plugin)) {
      if (isClass(plugin)) plugin = new plugin()  // new每次会产生一个不同的地址，多次添加都会生效
      if (isFunction(plugin['install']))  (plugin['install'] as Function).call(plugin, this, ...pluginConfig)
      else if (isFunction(plugin))/* 如果传入的是一个纯函数则直接运行*/  (plugin as Function).call(null, this, ...pluginConfig)
      this._PLUGINS_.push(plugin)
    }
    return this
  }

  /** 执行插件的钩子函数 */
  public executeHook<Data = null>(name: ExtractTiPluginEventInputName<Plugin> | string, data?: Data extends null ? any : Data)
    : TiEventTargetType<this, Data> {
    // 执行插件函数一一对应的hook,插件定义的函数名规则是 on + eventName 的驼峰写法
    const ev = {name, target: this, data}
    this._PLUGINS_
      .sort(({priority: A = 0}, {priority: B = 0}) => B - A)
      .forEach(plugin => {
        const callName = 'on' + capitalizeWords(ev.name)
        const callFunction  = plugin[callName]
        if (isFunction(callFunction)) callFunction.call(plugin, ev)
      })
    return ev
  }

  public clearHook(): void {
    this._PLUGINS_.splice(0, this._PLUGINS_.length)
  }
}


