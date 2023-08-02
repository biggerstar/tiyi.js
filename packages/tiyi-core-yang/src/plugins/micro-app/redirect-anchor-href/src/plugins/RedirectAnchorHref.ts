import {MicroApp, TiEventTargetType} from "tiyi-core";
import {isOnlyChangeHash, scrollToHashPosition} from "@/utils/common";
import {MicroAppBuiltInPlugin} from "@/interface";


/** a标签跳转支持与重定向 */
export class RedirectAnchorHref extends MicroAppBuiltInPlugin {
  public priority = 1000

  public onConnect(event: TiEventTargetType<MicroApp>) {
    const self = this
    const appWindow:Window = this.window

    appWindow.addEventListener('click', function (ev) {
      const target: HTMLAnchorElement = ev.target || ev['fromElement'] || ev['srcElement']
      if (target.tagName === 'A') {   // 只有a标签才处理
        const appURL = self.belongApp.url
        const onlyChangeHash = isOnlyChangeHash(self.belongApp.url, target.href)
        if (target.hash && onlyChangeHash) {  // 模拟浏览器原生只改变hash时的行为
          ev.preventDefault()
          // target.host = appWindow.location.host   // 不可使用该方式，影响其他click事件URL相关字段
          appWindow.dispatchEvent(new appWindow['PopStateEvent']('popstate'))
          if (target.hash !== (new URL(self.belongApp.url).hash)) {  // 当hash有变化才添加历史记录和触发hashchange
            appWindow.history.pushState(null, '', target.href)
            const hashchangeEvent = new appWindow['HashChangeEvent']('hashchange',{
              oldURL:appURL,
              newURL:target.href
            })
            appWindow.dispatchEvent(hashchangeEvent)
          }
          scrollToHashPosition(this.window, target.hash)  // 必须在pushState后面
        } else {
          self.belongApp.goto(target.href)
        }
      }
    })
  }
}

