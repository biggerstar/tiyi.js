import {getAppCache, isString} from 'tiyi-core'
import {MicroAppPropertyPlugin} from "@/interface";
import {resetUrlHost, updateAppBaseTag} from "@/utils/common";
/**
 * 子应用在同源或者about:blank下的iframe中的history对象操作动作和topWindow中的history对象操作动作一致，
 * 会直接影响到topWindow的浏览器显示地址与topLocation相关地址
 * 但是如果iframe中a标签hash或者location.hash赋值操作后调用的history.back()，会优先触发iframe的popstate而不会影响到topHistory操作
 * */
/** 该规则正常只用于子应用，只会修改子应用history对象而baseApp环境还是原来的对象不变  */
// 有个问题: 如果直接点浏览器后退按钮则不会执行popstate，必须在浏览器中点击一下聚焦后才能生效，但是正常用户行为都会操作网页且能正常聚焦，刷新的话[偶尔]需要重聚焦(未知规则)
export class YangHistoryReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect() {
    const topHistory: History = window['history']
    if (!topHistory) return
    const {History: RP} = getAppCache(this.belongApp.id, 'RPS')
    const appWindow = this.window
    const appHistory = this.window.history
    const appLocation = this.window.location
    const self = this
    const checkCrossOrigin = (url) => ![appLocation.origin, self.belongApp.location.origin].includes((new URL(url, appLocation.origin)).origin)  // 只允许top主域和app环境的域，其他都算跨域
    function patchHistory(type: 'push' | 'replace', state, title, url) {
      if (!isString(url)) url = ''
      const isCrossOrigin = checkCrossOrigin(url)
      const realUrl = resetUrlHost(url, location.href)
      url = realUrl ? realUrl : url
      if (type === "push") RP.rowPushState.call(appHistory, state, title, url)
      else if (type === "replace") RP.rowReplaceState.call(appHistory, state, title, url)
      if (!isCrossOrigin) {
        updateAppBaseTag(appWindow, self.belongApp.url)
      }
    }


    // TODO  修复bug， 子应用在加载原生非spa框架网页时，在主应用刷新后会丢失前进后退功能，修复方案，
    //  每次新增历史记录(点击a标签，浏览器直接输入url且只改变hash)触发popstate，或者hashchange时，通过pushState或者replaceState记录当前scrollY到state中，并在恢复时候滚动到原先位置
    this.addRules({
      /** pushState和replaceState只会触发事件，具体添加历史记录的逻辑需要在其他插件(npm package: tiyi-core-history)实现 */
      pushState: {
        value: function (state, title, url) {
          // console.log('pushState', state, title, url, realUrl);
          patchHistory("push", state, title, url)
        },
      },
      replaceState: {
        value: function (state, title, url) {
          // console.log('replaceState', state, title, url, realUrl);
          patchHistory("replace", state, title, url)
        },
      },
      // state:{}  // OnpopstateListener插件已经实现
      // scrollRestoration  // 默认不变就行
    })
    //-------------------------------------------------------
    this.define(this.window['history'])
  }
}
