import {PluginShareSetupOptions} from "../types/tiyi-share";
import {PluginEntryAdaptation, TiYiAppPluginInterface} from 'tiyi'
//-------------------------------------------
import * as TiYiApps from './tiyi-app'
import * as MicroApps from './micro-app'

export * from './tiyi-app'
export * from './micro-app'

const pluginEntry = new PluginEntryAdaptation()
pluginEntry.addTiYiPlugins(Object.values(TiYiApps))
pluginEntry.addMicroAppPlugins(Object.values(MicroApps))

export const createShareCenter: (shareConfig?: PluginShareSetupOptions) => TiYiAppPluginInterface = pluginEntry.export()
