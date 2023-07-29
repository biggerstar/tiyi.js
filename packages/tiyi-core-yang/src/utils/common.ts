import {getAppCache, isBool, isLinkScriptNode, isNumber, isObject, isScriptNode, MicroApp, setAppCache} from 'tiyi-core'
import {HistoryOptions} from "history-stack-manager";
import {__TI_APP__, __TI_HISTORY__} from "@/constant";
import {FilterUrlParamsKeys, TiHistoryOption} from "types";

export const scriptTextHook = {
  /** 获取不同模式下对脚本执行环境的注入 */
  getModeDefaultHookMap(mode: string /* yin or yang*/, type: string = 'text', data: object = {}) {
    const config = {
      map: {  /* 通常用于eval or Function方式执行js */
        yin: {
          window: data['proxyWindow'],
          top: data['proxyWindow'],
          document: data['proxyDocument'],
          location: data['location'],
        },
        yang: {
          window: data['proxyWindow'],
          document: data['proxyDocument'],
          location: data['location'],
        }
      },
      text: {  /* 通常用于标签方式script注入改变运行环境 */
        yin: {
          global: `${__TI_APP__}.proxyWindow`,
          window: `${__TI_APP__}.proxyWindow`,
          top: `${__TI_APP__}.proxyWindow`,
          document: `${__TI_APP__}.proxyDocument `,
          location: `${__TI_APP__}.location `,
        },
        yang: {
          window: `${__TI_APP__}.proxyWindow`,
          document: `${__TI_APP__}.proxyDocument`,
          location: `${__TI_APP__}.location`,
        }
      }
    }
    if (type === 'map') return mode === 'yin' ? config.map.yin : config.map.yang
    else if (type === 'text') return mode === 'yin' ? config.text.yin : config.text.yang
  }
}

export const isMircoAppEnv = (window: WindowProxy): boolean => !!window[__TI_APP__]
export const isTiYiAppEnv = (window: WindowProxy): boolean => window.top === window

/** 对节点重新排序，保证脚本在最后加载，css能优先于脚本加载更快首屏  */
export const sortScriptPriority = (next: HTMLElement, prev: HTMLElement) => {
  const isScriptNodeFlagPrev = isScriptNode(prev) || isLinkScriptNode(<HTMLLinkElement>prev)
  const isScriptNodeFlagNext = isScriptNode(next) || isLinkScriptNode(<HTMLLinkElement>next)
  if (isScriptNodeFlagPrev && !isScriptNodeFlagNext) return -1 //上面节点是脚本下面不是则将脚本移动下来
  return 0
}

/** 重新定义event对象的原型链引用
 * @param event event实例对象
 * @param Event 环境中的Event类
 * */
export function resetEventProtoRef(event, Event) {
  // Object.getPrototypeOf && Object.setPrototypeOf
  event['__proto__'] && (event['__proto__']['__proto__'] = Event.prototype)   // 重定义原型链到子应用Event对应原型
}

export const isTiHistory = (state:any): state is TiHistoryOption => state && isObject(state) && state?.type === __TI_HISTORY__

export function getEventTarget(event: Event): Element {
  return (event.target || event['srcElement']) as Element
}

export function toTiHistory(option: Partial<TiHistoryOption> | { action?: string }): object {
  const baseHistory = {
    type: __TI_HISTORY__
  }
  return Object.assign(baseHistory, option)
}

export function toNoHashUrlPath(url: string): string {
  return url.split('#').shift() as string
}

export function isOnlyChangeHash(oldHref: string, newHref: string): boolean {
  if (!oldHref.includes('#') && !newHref.includes('#')) return false  // 都不包含hash就直接返回false
  return toNoHashUrlPath(oldHref) === toNoHashUrlPath(newHref)
}

export function createAllowFocusAddHistory(app: MicroApp) {
  const appCache = getAppCache(app.id)
  const {window: appWindow} = appCache
  appWindow.addEventListener("unload", () => delete appCache['$historyFocus'])
  return {
    allow() {
      // console.log('focus')
      const {$historyFocus = 0} = getAppCache(app.id)
      if (isBool($historyFocus)) return  // 只有第一次
      setAppCache(app.id, {$historyFocus: true})
    },
    refuse() {
      // console.log('blur')
      setAppCache(app.id, {$historyFocus: false})
    },
    isAllow() {
      const {$historyFocus} = getAppCache(app.id)
      return !!$historyFocus
    }
  }
}


export function pushStateToAppWindow(toWindow: WindowProxy, {state, title, url, scrollY}: Partial<HistoryOptions> = {}) {
  const app = toWindow[__TI_APP__]
  window.history.pushState(toTiHistory({
    appName: app.id,
    state,
    title,
    url,
    scrollY: isNumber(scrollY) && toWindow.history.scrollRestoration === 'auto' ? scrollY : toWindow.scrollY,
    time: new Date().getTime()
  }), '', '')
}

export function replaceStateToAppWindow(toWindow: WindowProxy, {state, title, url, scrollY}: Partial<HistoryOptions> = {}) {
  console.log(scrollY);

  const app = toWindow[__TI_APP__]
  window.history.replaceState(toTiHistory({
    appName: app.id,
    state,
    title,
    url,
    scrollY: isNumber(scrollY) && toWindow.history.scrollRestoration === 'auto' ? scrollY : toWindow.scrollY,
    time: new Date().getTime()
  }), '', '')
}


export function getHashScrollPosition(toWindow, hash) {
  let targetTag = toWindow.document.getElementById(hash.replace('#', ''))
  if (targetTag) {  // 有找到targetTag说明要跳转到该锚点
    const rect = targetTag['getBoundingClientRect']()
    if (rect.top === 0) return // 如果已经在锚点位置了， 则不用再调用滚动
    return toWindow.scrollY + rect.top
  }
}

export function scrollToHashPosition(toWindow, hash) {
  const pos = getHashScrollPosition(toWindow, hash)
  if (isNumber(pos)) toWindow.scroll(0, pos)
}

const defaultUrlSplitOrderKeys: Array<FilterUrlParamsKeys> = ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash']

/** 过滤URL对象中指定字段，比如过滤url中的hash则直接传入excludes为['hash']便能去除hash部分 */
export function filterUrlParams(url: string, keys: Array<FilterUrlParamsKeys> = defaultUrlSplitOrderKeys, isIncludes: boolean = false) {
  const URLS = new URL(url)
  let urlString = ''
  defaultUrlSplitOrderKeys.forEach(name => {
    if (isIncludes && !keys.includes(name)/*只加载keys字段 */) return
    else if (!isIncludes && keys.includes(name) /*排除keys字段 */) return;
    let val = URLS[name]
    if (!val.trim()) return
    if (name === 'protocol') val = val + '//'
    if (name === 'port') val = ':' + val
    urlString = urlString + val
  })
  return urlString
}

export function updateAppBaseTag(toWindow: WindowProxy, url: string) {
  const baseTag = toWindow.document.head.querySelector('base')
  if (baseTag) {
    url = toNoHashUrlPath(url)
    if (baseTag.href === url) return  // 不变就不修改
    baseTag.href = url
  }
}

export function resetUrlHost(from: string, to: string) {
  const fromLocation = new URL(from, to)
  const toLocation = new URL(to)
  fromLocation.host = toLocation.host
  return fromLocation.href
}
