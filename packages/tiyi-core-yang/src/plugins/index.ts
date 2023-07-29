export * from './tiyi-app'
export * from './micro-app'
//---------------------------------------------------

import {MicroApp, PluginEntryAdaptation, TiYiApp} from "tiyi-core";
import * as TiYiApps from './tiyi-app'
import * as MicroApps from './micro-app'


export const TiYiPluginsForCoreYang = {
  install: (app: TiYiApp, ...args: any[]) => Object.values(TiYiApps).forEach(plugin => app.use(plugin, ...args))
}
export const MicroAppPluginsForCoreYang = {
  install: (app: MicroApp, ...args) => {
    Object.values(MicroApps).forEach(plugin => app.use(plugin, ...args))
  }
}

const pluginEntry = new PluginEntryAdaptation()
pluginEntry.addTiYiPlugins([TiYiPluginsForCoreYang])
pluginEntry.addMicroAppPlugins([MicroAppPluginsForCoreYang])

export const createCoreYang: Function = pluginEntry.export()
