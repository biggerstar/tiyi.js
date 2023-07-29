import {TiError} from "tiyi-core"
import {MicroAppBuiltInPlugin} from "@/interface";
import {__TI_BROADCAST__} from "@/constant";


export class SyncBroadcastApiForModeYang extends MicroAppBuiltInPlugin {
  public onConnect() {
    const self = this
    const parentWindow = this.window.top || this.window.parent
    if (!parentWindow[__TI_BROADCAST__]) return TiError('未找到父级的broadcast实例,请保证该插件之前在主应用上挂载了broadcast')
    self.belongApp.broadcast = parentWindow[__TI_BROADCAST__]
  }
}
