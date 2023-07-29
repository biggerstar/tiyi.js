import {TiYiPlugin} from "tiyi-core";


export class OnpopstateListener extends TiYiPlugin {
  public eventName: string = 'popstate'
  public beforeHis = null   // 上一个历史记录
  public beforeAction = null  // 上一个浏览器前进或后退操作

  public install1() {
    console.log('')
    // window.addEventListener(this.eventName, (event) => {
    //   return;
    //   /* 监听topWindow的popstate事件找到相关app信息，并分发给子应用 */
    //   const state: TiHistoryOption = event['state']
    //   if (isTiHistory(state)) {
    //     const {window: appWindow} = getAppCache(<string>state.appName)
    //     const app = <MicroApp>getMicroApp(<string>state.appName)
    //     if (!app || !appWindow) return
    //
    //     app.location.setHref(state.url, {isReload: false, toAnchorPoint: false, scrollY: state.scrollY})   // 不会刷新页面,也不会前往锚点
    //
    //
    //     let curAction = null
    //     let beforeAction = this.beforeAction
    //     const beforeState: TiHistoryOption = this.beforeHis
    //
    //     const isAllTiHistory = isTiHistory(state) && isTiHistory(beforeState)
    //
    //     if (isAllTiHistory) {
    //       const isCrossApp = state.appName !== beforeState.appName   // 只有在上个历史记录时跨app的时候才在转角处(比如上次操作浏览器前进，这次浏览器后退)多跳一次记录
    //       curAction = state.time > beforeState.time ? 'forward' : 'back'
    //       if (isCrossApp && isString(beforeAction) && isString(curAction) && beforeAction !== curAction) window.history[curAction]()
    //     }
    //     // else  curAction = 'back' // 之前的都是会有产生历史记录，如果还没被state，beforeState记录的情况下只能是浏览器后退
    //
    //     console.log(curAction);
    //
    //
    //     this.beforeHis = state
    //     this.beforeAction = curAction
    //     console.log('curAction', curAction, 'beforeAction', beforeAction, state, beforeState);
    //
    //   } else {
    //     delete window.history[__TI_HISTORY__]
    //   }
    //   // else 如果不是ti history的话则是tiyi主应用中 push加入的history
    // })
  }
}








