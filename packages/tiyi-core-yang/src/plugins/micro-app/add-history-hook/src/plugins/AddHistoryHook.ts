import {getAppCache, getTagName, MicroApp, TiEventTargetType} from "tiyi-core";
import {
  TiHistoryOption
} from 'types'
import {HistoryOptions} from "history-stack-manager";
import {MicroAppBuiltInPlugin} from "@/interface";
import {
  createAllowFocusAddHistory,
  getEventTarget,
  pushStateToAppWindow,
  replaceStateToAppWindow
} from "@/utils/common";

/** 在iframe设置同源的时候会激活history的历史记录添加功能，比如通过srcdoc可以获得原生添加历史记录的功能，
 * 但是该功能可拓展性不大，这边直接设置about:blank后点击锚点或者设置location [!不会自动添加] 历史记录，
 * 这样的话使得我们可以手动控制历史记录的添加，
 * 以便后面实现原生历史记录添加效果(core yang内置)或者单应用自行管理自身历史记录的效果(计划插件实现)
 * */
export class AddHistoryHook extends MicroAppBuiltInPlugin {
  public priority = 1000

  public onConnect(event: TiEventTargetType<MicroApp>) {
    return
    const app = this.belongApp
    const allowFocusAddHistory = createAllowFocusAddHistory(this.belongApp)
    const {window: appWindow} = getAppCache(this.belongApp.id)
    appWindow.addEventListener("focus", allowFocusAddHistory.allow)
    appWindow.addEventListener("blur", allowFocusAddHistory.refuse)
    appWindow.addEventListener("click", (ev) => {
      const target = getEventTarget(ev)
      if (allowFocusAddHistory.isAllow() && getTagName(target) === 'a') {
        app.location.setHref((target as HTMLAnchorElement).href, {
          isReload: false,
          toAnchorPoint: false,
          pushState: true
        })
        allowFocusAddHistory.refuse()
      }
    }, true)
  }

  public onLoad() {
    const app = this.belongApp
    if (app.url.includes("#")) {  // 有锚点前往锚点
      setTimeout(() => {
        app.location.setHref(app.url, {toAnchorPoint: true})
        // console.log(this.window.scrollY);
      }, 100)
    }
  }

  public onPushState(event: TiEventTargetType<MicroApp, TiHistoryOption>) {
    // if (this.firstLoad) return    // 历史记录只有第一次聚焦后才进行添加，和浏览器Event事件的isTrusted真实性验证一样，防止微应用污染主应用历史记录
    // console.log('onPushState', event.data);
    const appCache = getAppCache(this.belongApp.id)
    pushStateToAppWindow(appCache.window, <HistoryOptions>event.data)
  }

  public onReplaceState(event: TiEventTargetType<MicroApp, TiHistoryOption>) {
    // if (this.firstLoad) return
    // console.log('replaceState', event.data);
    const appCache = getAppCache(this.belongApp.id)
    replaceStateToAppWindow(appCache.window, <HistoryOptions>event.data)
  }
}
