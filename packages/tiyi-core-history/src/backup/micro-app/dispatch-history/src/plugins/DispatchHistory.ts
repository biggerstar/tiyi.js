import {MicroAppBuiltInPlugin} from "../../../../../interface";
import {getMicroApp, TiEventTargetType} from "tiyi-core";
import {MicroAppInterface} from "../../../../../ts/tiyi-core-yang";
import {isTiHistory} from "../../../../../utils/common";



export class DispatchHistory extends MicroAppBuiltInPlugin {
  onConnect(event: TiEventTargetType<MicroAppInterface>) {
    const self = this
    const appWindow = this.window
    const topHistory = window.history
    appWindow.addEventListener("focus", function () {
      if (isTiHistory(topHistory.state)) {
        const {appName} = topHistory.state
        const app = getMicroApp(appName)
        if (app === self.belongApp) return; // 聚焦后还是操作原来app则忽略，可能切换窗口或者点击浏览器外失焦再回来的
        console.log(self.belongApp.id, 'deactivate start');
        app.history.deactivate()   // 可能刷新可能其他原因，聚焦后如果存在[其他]app历史痕迹则清除掉痕迹
      }
      console.log(self.belongApp.id, 'active start');
      self.belongApp.history.active()
    })
  }
}
