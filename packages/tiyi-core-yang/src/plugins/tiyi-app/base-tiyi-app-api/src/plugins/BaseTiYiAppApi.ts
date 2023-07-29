import {getAppCaches, getMicroApps} from "tiyi-core";

export const BaseTiYiAppApi = {
  install(tiyiApp) {
    tiyiApp.window = window
    tiyiApp.config = {}
    tiyiApp.apps = getMicroApps()
    tiyiApp.appCache = getAppCaches()
  }
}
