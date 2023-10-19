// noinspection JSUnusedGlobalSymbols

import {TIYI} from "@/global";
import {MicroApp, MicroAppPlugin, TiYiApp, TiYiPlugin} from "@/interface";
import {TiEventTargetType} from "types";

/** 为插件创建一个适配的同一入口，使用该类创建后的插件可以在runtime时添加，里面添加的所有插件(TiYi框架插件或者微应用插件)都会生效
 * 支持TiYi.use 和 MicroApp.use 两个入口添加，效果都是一样的，区别是添加到框架上是全局生效，添加到MicroApp是某个微应用生效
 * */
export class PluginEntryAdaptation {
  private insPlugin?: object
  public tiyiAppPlugins: Array<TiYiPlugin> = []
  public microAppPlugins: Array<MicroAppPlugin> = []

  public addTiYiPlugins(plugins: Array<any>) {
    this.tiyiAppPlugins = this.tiyiAppPlugins.concat(plugins)
  }

  public addMicroAppPlugins(plugins: Array<any>) {
    this.microAppPlugins = this.microAppPlugins.concat(plugins)
  }

  /** 导出的函数中可以接受参数，该接受的参数可以在各个插件的install形参中接受到
   *  能接受配置参数的插件只有在tiyiAppPlugins和microAppPlugins列表里面的插件，插件上下文里面如果再添加插件需要自行将配置传到新插件中
   * */
  public export(): Function {
    const self = this
    return function (...pluginConfig: any[]) {   // 创建安装插件入口的工厂函数,比如 createCoreYan,支持在该函数运行时传入配置，这些配置可以在这些插件的install形参中接收
      if (!self.insPlugin) {
        self.tiyiAppPlugins.forEach(plugin => TIYI.use(plugin, ...pluginConfig)) // TIYI插件多次运行安装入口函数在use中只会被安装一次
        self.insPlugin = {
          install(app) {
            if (app === TIYI) {   // (全局所有生效)全局安装应用入口 TIYI.use
              TIYI.use({
                onMicroAppConnect({data: microApp}: TiEventTargetType<TiYiApp, MicroApp>) {
                  self.microAppPlugins.forEach(plugin => microApp?.use(plugin, ...pluginConfig))
                }
              })
            } else {  /* (单应用生效)微应用安装入口 MicroApp.use */
              self.microAppPlugins.forEach(plugin => app?.use(plugin, ...pluginConfig))  // 会为每个不同的微应用重新安装插件集，如果已经安装过，且createCoreYan等安装入口被多次运行,在MicroApp.use中也不会被重新安装
            }
          }
        }
      }
      return self.insPlugin
    }
  }
}



