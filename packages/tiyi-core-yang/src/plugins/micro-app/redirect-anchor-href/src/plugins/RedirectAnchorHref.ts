import {MicroApp, TiEventTargetType} from "tiyi-core";
import {isOnlyChangeHash} from "@/utils/common";
import {MicroAppBuiltInPlugin} from "@/interface";

/** a标签hash锚点跳转支持 */
export class RedirectAnchorHref extends MicroAppBuiltInPlugin {
  public priority = 1000

  public onConnect(event: TiEventTargetType<MicroApp>) {
    const self = this
    const appWindow = this.window

    appWindow.addEventListener('click', function (ev) {
      const target: HTMLAnchorElement = ev.target || ev['fromElement'] || ev['srcElement']
      if (target.tagName === 'A') {   // 只有a标签才处理
        // console.log(self.belongApp.url, target.href);
        const onlyChangeHash = isOnlyChangeHash(self.belongApp.url, target.href)
        // console.log(onlyChangeHash);
        if (target.hash && onlyChangeHash) {
          target.host = appWindow.location.host
        } else {
          // console.log(111111111111111111)
          self.belongApp.goto(target.href)
          // console.dir(target);
        }
        // TODO  attr target
      }
    })
  }
}




