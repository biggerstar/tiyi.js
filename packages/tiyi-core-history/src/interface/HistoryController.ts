import {
  extractGetter,
  getAppCache,
  getAppCaches,
  getMicroApp,
  MicroApp,
  TiEventTargetType,
  TIYI,
  TiYiApp
} from "tiyi-core";
import {__TI_HISTORY__, isTiHistory, toTiHistory} from "tiyi-core-yang";


const rowReplaceState = History.prototype.replaceState
const rowPushState = History.prototype.pushState

export class HistoryController {
  private allListenDocument: Array<Document>
  private baseWindow: WindowProxy | null

  constructor() {
    this.allListenDocument = []
    this.baseWindow = null
  }

  private generateAllAppState() {
    const allMicroAppCache = getAppCaches()
    let allAppStates = {}
    for (const appName in allMicroAppCache) {
      const app = <MicroApp>getMicroApp(appName)
      const {window} = allMicroAppCache[appName]
      const appHistory = window.history
      allAppStates[appName] = JSON.parse(JSON.stringify({
        url: app.url,
        state: appHistory.state
      }))
    }
    return Object.keys(allAppStates).length ? allAppStates : null
  }

  private redefineHistoryPrototype(targetWindow: WindowProxy) {
    const historyPrototype = targetWindow['History'].prototype
    const row_getter_state = extractGetter(historyPrototype, 'state')
    Object.defineProperties(historyPrototype, {
      state: {
        get(): any {
          const state = row_getter_state.call(this)
          return isTiHistory(state) ? state.state : state
        }
      },
      [__TI_HISTORY__]: {
        get(): any {
          return row_getter_state.call(this)
        },
        enumerable: true,
        configurable: false,
      }
    })
  }

  private patchHistoryToApps() {
    const allAppHistory = history[__TI_HISTORY__].data || {}
    for (const appName in allAppHistory) {
      const microApp = <MicroApp>getMicroApp(appName)
      const info = allAppHistory[appName]
      console.log(info.url ,microApp.url, info);
      if (info.url !== microApp.url) microApp['goto'](info.url)

    }
    console.log(allAppHistory);
  }

  private syncPush(targetWindow: WindowProxy) {
    console.log('syncPush');
    const allAppState = this.generateAllAppState()
    if (targetWindow !== this.baseWindow) {
      const targetHistory = targetWindow.history
      const microApp = targetWindow.__TI_APP__
      const {rowValidationReplaceState: rowAppReplaceState}
        : { rowValidationReplaceState: Function }
        = getAppCache(microApp.id, 'stateOperation')
      rowAppReplaceState.call(targetHistory, toTiHistory({
        state: isTiHistory(targetHistory.state) ? targetHistory.state.state : targetHistory.state,
      }), '', '')
    }
    rowPushState.call(history, toTiHistory({
      state: isTiHistory(history.state) ? history.state.state : history.state,
      data: allAppState
    }), '', '')
  }

  /** 将当前的所有app情况同步记录到历史记录的state中 */
  private sync(targetWindow: WindowProxy) {
    const allAppState = this.generateAllAppState()
    if (targetWindow !== this.baseWindow) {
      const targetHistory = targetWindow.history
      const microApp = targetWindow.__TI_APP__
      const {rowValidationReplaceState: rowAppReplaceState}
        : { rowValidationReplaceState: Function }
        = getAppCache(microApp.id, 'stateOperation')
      rowAppReplaceState.call(targetHistory, toTiHistory({
        state: isTiHistory(targetHistory.state) ? targetHistory.state.state : targetHistory.state,
      }), '', '')
    }
    rowReplaceState.call(history, toTiHistory({
      state: isTiHistory(history.state) ? history.state.state : history.state,
      data: allAppState
    }), '', '')
  }

  private interceptHistoryChange(targetWindow: Window) {
    const self = this
    const targetHistory = targetWindow.history
    const rowTargetPushState = targetWindow['history'].pushState
    const rowTargetReplaceState = targetWindow['history'].replaceState
    targetHistory.pushState = function (state: any, title: string, url: string) {
      rowTargetPushState.call(this, state, title, url)
      self.sync(targetWindow)
    }
    targetHistory.replaceState = function (state: any, title: string, url: string) {
      rowTargetReplaceState.call(this, state, title, url)
      self.sync(targetWindow)
    }
    targetWindow.addEventListener("popstate", () => {
      const tiHistory = targetHistory[__TI_HISTORY__]
      // console.log('state', tiHistory);
      if (this.baseWindow === targetWindow && isTiHistory(tiHistory)) {   // history back
        console.log(111111111111111111)
        setTimeout(() => {
          this.patchHistoryToApps()
        })
        // if (self.baseWindow === targetWindow) {
        //   console.log(111111111111111111)
        // } else {
        //   console.log(222222222222222222)
        //   self.sync(targetWindow)
        // }
      } else {   // history forward
        if (this.baseWindow !== targetWindow){
          setTimeout(() => {
            this.patchHistoryToApps()
          })
        }
        console.log(33333333333333333)
        self.sync(targetWindow)
      }
    })
  }

  public listenAppWindow(targetWindow: WindowProxy, isBaseWindow: boolean = false) {  // 支持tiyiApp 和 microApp 的改造
    if (this.allListenDocument.find(item => item === targetWindow.document)) return
    if (isBaseWindow) this.baseWindow = targetWindow
    const self = this

    if (isBaseWindow && isTiHistory(history.state)) {  // 刷新情况走这里
      const {history} = targetWindow
      // console.log(history.state);
      TIYI.use({
        firstRun: true,
        onCreateMicroApp(event: TiEventTargetType<TiYiApp, MicroApp>) {
          const microApp = event.data
          let firstRun = true
          microApp.use({
            onGoto(event: TiEventTargetType<MicroApp>) {
              if (!firstRun) return
              firstRun = false
              const allAppHistory = history[__TI_HISTORY__]?.data || {}
              const info = allAppHistory[microApp.id]
              if (!info) return;
              console.log('reload history info', info);
              event.data = info.url
            }
          })
        }
      })
    } else {
      self.sync(targetWindow)  // 首次链接同步当前app信息到top
    }
    self.redefineHistoryPrototype(targetWindow)
    self.interceptHistoryChange(targetWindow)
    this.allListenDocument.push(targetWindow.document)
  }
}
