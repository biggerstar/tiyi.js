import {MicroApp, TiEventTargetType} from "tiyi-core";
import {MicroAppBuiltInPlugin} from "@/interface";
import {updateAppBaseTag} from "@/utils/common";

export class SyncAppBaseTagUrl extends MicroAppBuiltInPlugin{
  onConnect(event: TiEventTargetType<MicroApp>) {
    const appWindow = this.window
    const self = this
    appWindow.addEventListener("popstate", () => {
      updateAppBaseTag(appWindow, self.belongApp.url)
    })
  }
}
