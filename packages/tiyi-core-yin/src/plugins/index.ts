import {MicroAppInterface} from "tiyi-core-yang";

export * from "./micro-app"
//---------------------------------------------------
import {PluginEntryAdaptation} from "tiyi-core";
import * as MicroApps from './micro-app'


export const MicroAppPluginsForCoreYin = {
  install: (app: MicroAppInterface,...args) => Object.values(MicroApps).forEach(plugin => app.use(plugin,...args))
}

const pluginEntry = new PluginEntryAdaptation()
pluginEntry.addMicroAppPlugins([MicroAppPluginsForCoreYin])

export const createCoreYin: Function = pluginEntry.export()
