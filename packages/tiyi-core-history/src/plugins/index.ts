import {MicroApp, PluginEntryAdaptation, TiYiApp} from "tiyi-core";
import * as TiYiApps from './tiyi-app'
import * as MicroApps from './micro-app'

export * from './tiyi-app'
export * from './micro-app'
//---------------------------------------------------
export const TiYiPlugins = {
  install: (app: TiYiApp, ...args: any[]) => Object.values(TiYiApps).forEach(plugin => app.use(plugin, ...args))
}
export const MicroAppPlugins = {
  install: (app: MicroApp, ...args) => {
    Object.values(MicroApps).forEach(plugin => app.use(plugin, ...args))
  }
}

const pluginEntry = new PluginEntryAdaptation()
pluginEntry.addTiYiPlugins([TiYiPlugins])
pluginEntry.addMicroAppPlugins([MicroAppPlugins])

export const createHistorySyncManager: Function = pluginEntry.export()
