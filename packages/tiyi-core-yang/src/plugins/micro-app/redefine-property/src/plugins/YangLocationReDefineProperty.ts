import {getAppCache, isNumber, isString, TiTypeError, TiURIError} from "tiyi-core"
import {SetHrefOptions} from "types";
import {MicroAppPropertyPlugin} from "@/interface";
import {getHashScrollPosition, isOnlyChangeHash} from "@/utils/common";

/** 注意点: 在能接受hash赋值的location下如果有hash任何情况不会引起页面刷新,且会改变当前hash的只有hash和href字段
 *  且#号后面内容不管是啥都是hash，比如#号后面还有search或者pathname都会被归为hash而不会解析成对应字段
 *  为什么不直接设置location.hash改变锚点? 答： about:blank 下iframe锚点会在主窗口跳转而不是在iframe跳转，这样会不符合预期
 * */
export class YangLocationReDefineProperty extends MicroAppPropertyPlugin {
  //@ts-ignore
  public fakeLocation: URL   //  子应用映射的location，可以直接修改不会进行网页刷新或跳转

  /** 传入新旧两个location并分析两个差异，返回新location的改变字段集  */
  // public static filterLocationChangeField(oldLocation, newLocation, excludeLList = []) {
  //   const defaultExcludeLList = []
  //   excludeLList = excludeLList.concat(defaultExcludeLList)
  //   const changeMap = {}
  //   for (const k in newLocation) {
  //     //@ts-ignore
  //     if (excludeLList.includes(k)) continue
  //     let oldVal = oldLocation[k], newVal = newLocation[k]
  //     if (!isString(oldVal)) continue
  //     if (oldVal !== newVal) {  // 筛选出所有改变的字段
  //       changeMap[k] = {
  //         from: oldLocation[k],
  //         to: newLocation[k],
  //       }
  //     }
  //   }
  //   return changeMap
  // }

  // public patchPopstateEvent() {
  //   const {window: appWindow} = getAppCache(this.belongApp.id)
  //   const PopStateEvent = window['PopStateEvent']
  //   const event = new PopStateEvent('popstate')
  //   Object.defineProperty(event, 'state', {
  //     get() {
  //       return appWindow.history.state
  //     },
  //     enumerable: true,
  //     configurable: true
  //   })
  //   appWindow.dispatchEvent(event)  // 模拟浏览器点击a标签触发popstate事件 TODO hashchange
  // }

  public reload(isReload = true): void {
    isReload ? this.belongApp.goto(this.fakeLocation.href) : null
  }

  /** 这里设置传入的href 有效类型 [ href, pathname, hash, search ] ,详情请看ts定义
   * 该函数url传入和之前的url对比: 只要改变了 pathname 或 search 或者 href 不管是否包含hash必然是会刷新
   *
   * */
  public setHref(href, {
    isReload = null,
    toAnchorPoint = true,
    checkSameHost = true,
    popstate = false,
    pushState = false
  }: Partial<SetHrefOptions> = {}) {
    href = String(href).trim() // 处理传入数字pathname路径情况
    const newLocation = new URL(href, this.fakeLocation.href)
    const oldHref = this.fakeLocation.href
    const newHref = newLocation.href
    // console.log(oldHref, newHref);
    //--------------------------------------------------------
    /** 检测是否同源 */
    if (checkSameHost && (newLocation.origin !== this.fakeLocation.origin)) return TiURIError(href + '\thref不能成功设置到域\t' + this.fakeLocation.origin + '\t中')
    //--------------------------------------------------------
    // if (toAnchorPoint) {
    //   const onlyChangeHash = isOnlyChangeHash(oldHref, newHref)
    //   // console.log(onlyChangeHash);
    //   if (pushState) this.window.location.hash = href
    //   if (onlyChangeHash || href.startsWith('#')) {  // 如果是开始goto或者点击a标签，hash开头的url和当前url一致只是hash变了，则跳转锚点
    //     isReload = false  // 只改变了hash不会进行刷新
    //     // if (newLocation.hash !== this.fakeLocation.hash) pushState = true  // toAnchorPoint(必要条件)下只改变hash会添加历史记录
    //     if (popstate) this.patchPopstateEvent()
    //     scrollY = getHashScrollPosition(this.window, newLocation.hash)
    //   }
    // }
    // // //--------------------------------------------------------
    // if (isNumber(scrollY)) {  // 顺序要在添加历史记录之前，先滚动到该位置，之后历史记录添加的时候会将该位置记录
    //   this.window.scroll(0, scrollY)
    // }


    //
    // //--------------------------------------------------------
    // const defaultHistory = {state: null, title: '', url: newLocation.href}
    // const allowFocusAddHistory = createAllowFocusAddHistory(this.belongApp)
    //
    // if (pushState) {   // pushState优先级比replaceState高
    //   let isReOrder = false
    //   const beforeState: TiHistoryOption = window.history.state
    //   pushState = <HistoryOptions>pushState === true ? defaultHistory : Object.assign(defaultHistory, pushState)
    //   // 1.该app被第一次设置操作历史记录的情况下(该部分逻辑比较难以理解，看源码的同学自啃吧-_- )
    //   if (allowFocusAddHistory.isAllow()) {
    //     if (isTiHistory(beforeState)) {  // 2.检查前面最后聚焦历史记录的app是主应用还是其他子应用
    //       const {appName} = beforeState
    //       if (appName !== app.id) {  // 3.如果是其他的子应用,则替换之前子应用的history，在本次pushState添加后追加在该记录末尾
    //         isReOrder = true
    //         replaceStateToAppWindow(this.window, <HistoryOptions>pushState)
    //       }
    //     }
    //   }
    //
    //   if (isReOrder) {
    //     const {window: beforeWindow} = getAppCache(<string>beforeState.appName)
    //     pushStateToAppWindow(beforeWindow, <HistoryOptions>beforeState) // 这里直接修改其他app产生的历史记录
    //   } else {
    //     this.belongApp.executeHook('pushState', pushState)
    //   }
    // }
    //
    // if (replaceState) {
    //   replaceState = replaceState === true ? defaultHistory : Object.assign(defaultHistory, replaceState)
    //   this.belongApp.executeHook('replaceState', replaceState)
    // }
    //--------------------------------------------------------
    this.fakeLocation.href = newLocation.href
    this.belongApp.url = newLocation.href
    this.reload(Boolean(isReload))
  }

  public onDestroyed() {
    // @ts-ignore
    delete this.belongApp?.location
  }

  public onConnect() {
    const self = this
    const URL = this.window['URL']
    this.fakeLocation = new URL(this.belongApp.url)   // 在子应用中对location所有的修改都会被映射到这边来
    class Location {
    }

    //--------------------------------------------------------------
    // @ts-ignore
    this.belongApp.location = Object.assign(new Location(), this.fakeLocation)
    this.addRules({
      /** 修改fakeLocation不会造成任何刷新 */
      fakeLocation: {
        get() {
          return self.fakeLocation
        }
      },
      setHref: {
        value: function (href, options) {
          self.setHref(href, options)
        }
      },
      // ----------------------------------------
      ancestorOrigins: {
        get() {
          return [self.belongApp.url]
        }
      },
      assign: {
        value: function (url) {
          /* 加入历史记录并会改变location*/
          self.setHref(url, {
            isReload: true,
            checkSameHost: false,
            pushState: true
          })
        }
      },
      hash: {
        get() {
          return self.fakeLocation.hash
        },
        set(hash: string) {
          if (/* 首字符没有#会添加上去 */ !hash.startsWith('#')) hash = '#' + hash
          self.setHref(hash, {pushState: true})
        }
      },
      host: {
        get() {
          return self.fakeLocation.host
        },
        set(host: string) { /* host不管和当前相不相等都会刷新,下面hostname也一样 */
          if (host === '') return  /* 浏览器默认'' 报错，这里忽略,但是如果' '包含内容还是会重新reload */
          const L = new URL(self.fakeLocation.href)    // 创建一个新的URL是防止外部传入@./等等等奇形怪状的字符，而这些字符会被URL类忽略不会改变原有的host，下面hostname也一样
          L.host = host
          if (L.host !== self.fakeLocation.host) {   // 传入正确的host且和原来不想等才修改并前往
            self.fakeLocation.host = host
            self.reload()
          }
        }
      },
      hostname: {  /* 注释同上面host */
        get() {
          return self.fakeLocation.hostname
        },
        set(hostname: string) {
          if (hostname === '') return
          const L = new URL(self.fakeLocation.href)
          L.hostname = hostname
          if (L.hostname !== self.fakeLocation.hostname) {
            self.fakeLocation.hostname = hostname
            self.reload()
          }
        }
      },
      href: {
        get() {
          return self.fakeLocation.href
        },
        set(href: string) {
          if (href.trim() === '') href = '/'
          self.setHref(href, {isReload: true, pushState: true})
        }
      },
      origin: {
        get() {
          return self.fakeLocation.origin
        },
        set() {
        }
      },
      pathname: {
        get() {
          return self.fakeLocation.pathname
        },
        set(pathname: string) {
          if (/* 首字符没有/会添加上去，因为pathname是根据根节点来的 */ !pathname.startsWith('/')) pathname = '/' + pathname
          self.setHref(pathname, {isReload: true, pushState: true})
        }
      },
      port: {
        get() {
          return self.fakeLocation.port
        },
        set(port: string) {
          const parseInfo = parseInt(port)
          port = parseInfo.toString()  /* 浏览器默认解析规则  20(number | string) -> 20, 20Text -> 20, Text20 -> 不响应 */
          if (isNaN(parseInfo) || port === 'NaN') return  // 如果解析不到端口则忽略, 用NaN文本是防御性编程
          if (self.fakeLocation.port === port) return /* 端口没变,忽略 */
          self.fakeLocation.port = port
          self.reload()
        }
      },
      protocol: {
        get() {
          return self.fakeLocation.protocol
        },
        set(protocol: string) {
          if (!protocol.endsWith(':')) protocol = protocol + ':'
          protocol = protocol.toLowerCase()
          if (['http:', 'https:', 'ws:', 'wss:'].includes(protocol)) {   /* 可以跳转的白名单模式 */
            if (self.fakeLocation.protocol === protocol) return /* 协议没变也忽略 */
            self.fakeLocation.protocol = protocol
            self.belongApp.goto(self.fakeLocation.href)
          } else {  /* file, ftp 等协议也会报错 */
            TiTypeError('protocol协议错误', protocol)
          }
        }
      },
      reload: {
        value: self.reload
      },
      replace: {
        value: function (url) {
          self.setHref(url, {isReload: true, replaceState: true})  // 直接跳转,不会设置history
        }
      },
      search: {
        get() {
          return self.fakeLocation.search
        },
        set(search: string) {
          if (/* 如果是空字符串也会被添加一个? */ !search.startsWith('?')) search = '?' + search
          self.setHref(search, {isReload: true, pushState: true})
        }
      },
      toString: {
        value: function () {
          return self.fakeLocation.href
        }
      },
      valueOf: {
        value: function () {
          return self.belongApp.location
        }
      }
    })
    //--------------------------------------------------------
    this.define(this.belongApp.location)
  }
}



