import {getAppCache, isNumber, TiEventTargetType, TIYI, TiYiAppInterface, TiYiAppPluginInterface} from "tiyi-core";
import {MicroAppInterface} from '../../../../../ts/tiyi-core-yang'
import {__TI_HISTORY__} from "../../../../../mapping/constant";
import {isTiHistory} from "../../../../../utils/common";

export class HistoryManager {
  private isActive = false
  public belongApp: MicroAppInterface
  public window: WindowProxy
  public point: number = 0  // 指向当前页面对应历史记录下标
  public stack: Array<any> = []

  private scrollTo(x: number = 0, y: number = 0) {
    console.log('scrollTo', x, y);
    this.window.scroll(x, y)
  }

  public maxPoint() {
    return this.stack.length - 1 || 0
  }

  public index(to: number) {
    if (to > this.stack.length - 1) return
    this.point = to
    console.log('index to', to);
    const {state} = this.stack[to]
    if (isNumber(state.scrollY)) this.scrollTo(0, state.scrollY)
  }

  public back() {
    const nextPoint = this.point - 1
    if (nextPoint < 0) return // 到最后一个直接退出
    this.point = nextPoint
    const history = this.stack[nextPoint]
    const {state, url} = history
    if (isNumber(state.scrollY)) this.scrollTo(0, state.scrollY)
  }

  public forward() {
    const nextPoint = this.point + 1
    if (nextPoint > this.stack.length - 1) return
    this.point = nextPoint
    const history = this.stack[nextPoint]
    const {state, url} = history
    if (isNumber(state.scrollY)) this.scrollTo(0, state.scrollY)
  }

  public go(step: number = 0) {
    const nextPoint = this.point + step
    if (nextPoint < 0) return
    if (nextPoint > this.stack.length - 1) return
    this.point = nextPoint
    const history = this.stack[nextPoint]
    const {state, url} = history
    if (isNumber(state.scrollY)) this.scrollTo(0, state.scrollY)

  }

  public push(url: string, state: object = {}) {
    const scrollY = this.window.scrollY
    this.stack.splice(this.point + 1, this.stack.length - this.point - 1)  // 在栈中间push会截断后面记录，最低保留一个当前页记录
    url = (new URL(url, this.belongApp.url)).href
    state.scrollY = scrollY
    const history = {
      url,
      state
    }
    this.stack.push(history)
    this.point = this.stack.length - 1
    if (this.isActive) {  // 如果正在操作该app，则有新添加的历史记录会直接同步到topHistory
      this.pushState({
        point: this.point,
        history: history
      })
    }
  }

  public replace(url: string, state: object = {}) {
    this.stack.pop()
    this.push(url, state)
  }


  public pushState(mergeOption) {
    if (!this.isActive) return
    console.log('pushState', mergeOption);
    const app = this.belongApp
    const {window: topWindow} = TIYI
    const topHistory: History = topWindow.history
    const state = mergeOption ? {
      appName: app.id,
      type: __TI_HISTORY__,
      ...mergeOption
    } : mergeOption
    topHistory.pushState(state, '', '')
    console.log(topHistory.state);
  }

  public deactivate() {
    console.log(111111111111111111)
    this.isActive = false
    const topHistory = window.history
    if (!isTiHistory(topHistory.state)) return
    const {point} = topHistory.state
    const nextPoint = -point - 1 // point最小是0，nextPoint必然是负数
    // const nextPoint = window.history.length - this.recordLen
    console.log('go', nextPoint);
    topHistory.go(-nextPoint)
    window.history.replaceState({break: 'hahahha'}, '', '')   // 目的是截断浏览器内置历史记录栈
  }

  public active() {
    if (this.isActive) return
    this.isActive = true
    const app = this.belongApp
    const {window: topWindow} = TIYI
    const topHistory: History = topWindow.history
    const appHistory: HistoryManager = app.history

    console.log('当前', app.id, 'state', topHistory.state, 'stack', appHistory.stack)
    console.log('active point', this.point);
    console.log(appHistory.stack);
    window.history.pushState(null,'','')  // 目的是给deactivate失活后调用go函数做缓冲
    appHistory.stack.forEach((history, index) => {

      this.pushState({
        point: index,
        history: history
      })
    })
    const firstGoBackOffset = this.stack.length - 1 - this.point
    console.log('firstGoBackOffset', firstGoBackOffset);
    if (firstGoBackOffset !== 0) topHistory.go(-(firstGoBackOffset))
  }
}


// setTimeout(() => {
//   // window.top.a.go(-1)
//   window.top.a.back()
//   console.log(window.top.a.stack[0]);
//   window.top.a.push('#hash111')
//   window.top.a.push('#hash111')
//   window.top.a.push('#hash111')
//   setTimeout(() => {
//     // window.top.a.go(1)
//     window.top.a.forward()
//     window.top.a.back()
//     window.top.a.back()
//     window.top.a.back()
//     window.top.a.back()
//     window.top.a.back()
//     window.top.a.back()
//     setTimeout(() => {
//       // window.top.a.go(1)
//       console.log(window.top.a.stack);
//       window.top.a.push('#hash111')
//       window.top.a.push('#hash222')
//       window.top.a.push('#hash333')
//       setTimeout(() => {
//         // window.top.a.go(1)
//         window.top.a.forward()
//       }, 1000)
//     }, 1000)
//   }, 1000)
// }, 1500)


export const HistoryStackManagerPlugin: TiYiAppPluginInterface = {
  onCreateMicroApp(event: TiEventTargetType<TiYiAppInterface, MicroAppInterface>) {
    const app = event.data
    app.history = new HistoryManager()

  },
  onMicroAppConnect(event: TiEventTargetType<TiYiAppInterface, MicroAppInterface>) {
    const app = event.data
    const {window: appWindow} = getAppCache(app.id)
    app.history.belongApp = app
    app.history.window = appWindow
  }
}

