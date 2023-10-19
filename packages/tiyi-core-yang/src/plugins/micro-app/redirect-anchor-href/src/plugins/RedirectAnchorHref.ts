import {MicroApp, TiEventTargetType} from "tiyi-core";
import {isOnlyChangeHash, scrollToHashPosition} from "@/utils/common";
import {MicroAppBuiltInPlugin} from "@/interface";


/** a标签跳转支持与重定向 */
export class RedirectAnchorHref extends MicroAppBuiltInPlugin {
  public onConnect(event: TiEventTargetType<MicroApp>) {
    const self = this
    const appWindow: Window = this.window
    appWindow.addEventListener('click', function (ev) {
      const target: HTMLAnchorElement = ev.target || ev['fromElement'] || ev['srcElement']
      if (target.tagName === 'A') {   // 只有a标签才处理
        const onlyChangeHash = isOnlyChangeHash(self.belongApp.url, target.href, false)
        if (target.hash && onlyChangeHash) {  // 模拟浏览器原生只改变hash时的行为
          ev.preventDefault()
          self.belongApp.location.setHref(target.href,{
            popstate:true,
            hashchange:true,
            scrollToHash:true,
            pushState:true,
          })
        } else {
          self.belongApp.goto(target.href)
        }
      }
    })
  }
}
