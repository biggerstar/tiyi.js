import {
  DefineAppError,
  fetchText,
  getAppCache,
  getMicroApp,
  isAsyncFunction,
  isFullUrl,
  isFunction,
  isString,
  MicroApp,
  RecursionAppPageBlocked,
  setAppCache,
  setMicroApp,
  TiError,
  TiURIError,
  TIYI,
  tryDoCatch,
} from "tiyi-core"
import {resetIframeSandboxEnv} from "../utils/common";
import {isOnlyChangeHash, isTiHistory, isTiYiAppEnv} from "@/utils/common";
import {__TI_APP__, __TI_HISTORY__} from "@/constant";

export function mount(target: HTMLElement | string): MicroApp {
  const app: MicroApp = this
  if (!target) {
    DefineAppError('请定义App的唯一id字段: id，或者HTMLElement对象')
    return app
  }
  let el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) {
    TiError('未在DOM中找到微应用挂载的元素', target)
    return app
  }
  if (app._mounted_) {
    TiError('app已经在运行', target)
    return app
  }
  /* ---------------------------------------------------------------------------- */
  Object.defineProperty(app, 'id', {
    value: el.id,
    enumerable: true,
    configurable: false
  })
  if (!app.id) {
    TiError('请为目标元素节点设定一个唯一的id值', target, el)
    return app
  }
  /* ---------------------------------------------------------------------------- */
  Object.defineProperty(app, 'baseURL', {
    get: () => {
      if (!this.url) return ''
      const urlInfo = new URL(this.url)
      return urlInfo.origin + urlInfo.pathname
    }
  })
  /* ---------------------------------------------------------------------------- */
  app.executeHook('install')
  /* ---------------------------------------------------------------------------- */
  tryDoCatch(() => {
    Object.defineProperty(<object>app, '_mounted_', {
      value: true,
      configurable: false,
      enumerable: true
    })
  })
  /* ---------------------------------------------------------------------------- */
  // /* 尝试创建应用专属标签并替代目标id所属 */ /* @deprecated 弃用重建标签*/
  // if (getTagName(el) !== __TAG_NAME__.toUpperCase()) {   // 如果在当前网页中已存在且传入的不是自定义的app标签则创建一个并添加
  //   let appEl = document.createElement(__TAG_NAME__)
  //   extendNodeAttributes(el, appEl)
  //   el.parentNode.replaceChild(appEl, el)
  //   el = appEl  /* 将最新的el保存 */
  // }
  /* ---------------------------------------------------------------------------- */
  const iframe: HTMLIFrameElement = document.createElement('iframe')
  iframe.style.backgroundColor = '#fff'   // 重置父元素样式影响，具体子应用样式会在子应用中进行定义
  iframe.setAttribute('data-app-id', app.id)

  // iframe.setAttribute('sandbox','allow-scripts')
  el.appendChild(iframe)
  const iframeInfo = {
    iframe: iframe,
    window: iframe?.contentWindow,
    document: iframe?.contentWindow?.document,
  }
  /* 缓存拿到加载后的初始window和document和app本身 */
  setMicroApp(app.id, app)
  setAppCache(app.id, {...iframeInfo, el})
  app.executeHook('installed')
  return this
}


/** 外部设置的html函数或者文本自动识别并调用_loadHTML函数进行加载 */
export function html(html: string | Function | ((args: any[]) => Promise<any>)) {
  const app: MicroApp = this
  if (!app.url) app.url = location['href']  // 正常是第一次加载,如果之前没有使用goto指定过url，则默认使用和主应用的url作为子应用的基准地址
  connect(app.id).then(() => {
    const {data: newHtml} = app.executeHook('loadHTML', html)
    if (isString(newHtml)) app.executeHook('loadHTML', html)
    else if (isAsyncFunction(newHtml)) (newHtml as Function)().then((text: string) => app.executeHook('loadHTML', text))  // 异步函数也是函数,这里判断优先级要在前面
    else if (isFunction(newHtml)) app.executeHook('loadHTML', (newHtml as Function)())
    else return DefineAppError('html的值类型错误')
  })
}

/** 获取远程html并加载到子应用的dom中 */
export function goto(url: string): void {
  if (!url) return TiURIError('goto:未传入url参数')
  const app: MicroApp = this
  let firstLoad = !app.url
  if (firstLoad) { // 正常是第一次加载未指定完整的url，比如/aa/bb等形式，则以主应用url作为基准地址,若是完整地址则直接赋值给app.url
    if (isFullUrl(url)) app.url = url
    else app.url = new URL(url, location.href).href
  }
  //-----------------------------------------------------------
  const {iframe, window: appWindow} = getAppCache(app.id)
  //-----------------------------------------------------------
  if (appWindow) appWindow.stop() // && clearAllTimer(window)
  //   if (appWindow) appWindow.stop() // && clearAllTimer(window)
  //-----------------------------------------------------------
  const ev = app.executeHook('goto', url)   // 插件里面直接修改app.url或者事件对象的data，后面请求的url就会用app.url，可以用来做代理,后面考虑优化逻辑
  const {data: newUrl} = ev
  console.log('goto', newUrl);
  // ---------检测是否应用被无限嵌套------------------
  const urlInfo = new URL(newUrl as unknown as string, app.baseURL)
  const nowBaseURL = app.baseURL
  const newBaseURL = urlInfo.origin + urlInfo.pathname
  // console.log(nowBaseURL, newBaseURL, !isTiYiAppEnv(window));
  if (nowBaseURL === newBaseURL && !isTiYiAppEnv(window)) return RecursionAppPageBlocked(app.url)
  // ---------------------------------------------
  console.log(firstLoad, isOnlyChangeHash(urlInfo.href, app.url, false), urlInfo.href, app.url);
  if (!firstLoad && isOnlyChangeHash(urlInfo.href, app.url, false)) {  // dom已存在，且只改变hash则跳转hash
    app.location.setHref(urlInfo.hash, {
      scrollToHash: true,
      isReload: false,
    })
    return
  }
  if (!newUrl.startsWith('about:blank')) app.url = urlInfo.href
  app.use({  // 如果加载的url中存在hash，则在dom加载完成后跳转到指定hash
    onLoad() {
      if (urlInfo.hash) {
        const isPushState = !isTiHistory(history[__TI_HISTORY__])
        setTimeout(() => {  // TODO  处理实现正确的load逻辑，该处优化可去除定时器
          app.location.setHref(urlInfo.href, {
            scrollToHash: true,
            isReload: false,
            pushState: isPushState,
          })
        })
      }
    }
  })
  fetchText(app.url)
    .then((html: string | null) => {  // 只有获取到了html资源后再重载dom，否则还是显示之前的界面
      connect(app.id).then(() => {
        // console.log(111111111111111111)
        //-----------------------------------------------------------
        iframe.setAttribute('data-app-src', app.url)
        app.executeHook('loadHTML', html)
      })
    })
    .catch(error => {
      console.error(error);
      // TODO insert error page to dom
    })
}

/** 将子应用置空销毁重置到纯净环境
 * @param appName 微应用名称
 * @param mode  blank: 浏览器空白页， origin: 请求同源域网页并在合适时机置空dom
 * */
export async function destroy(appName: string, mode?: 'blank' | 'origin') {
  const {window} = getAppCache(appName)
  if (!window) return
  const app = <MicroApp>getMicroApp(appName)  // 如果iframe环境中已经存在app，执行清空逻辑，如果没有则是第一次加载
  const isFirstLoad = !window[__TI_APP__]
  if (!isFirstLoad) app.executeHook('beforeDestroy')
  await resetIframeSandboxEnv(appName, mode)
  if (!isFirstLoad) {
    app.executeHook('destroyed')   // 已清空,发起通知,要在microAppDestroy之前，microAppDestroy做善后工作
    TIYI.executeHook('microAppDestroy', app)
  }
}

/** 将app定义的环境应用到iframe中 */
async function connect(appName: string) {
  const {window} = getAppCache(appName)
  const app = <MicroApp>getMicroApp(appName)
  await destroy(appName, 'origin')
  window[__TI_APP__] = app
  TIYI.executeHook('microAppConnect', app)  //  microAppConnect在app.connect之前，做初始化工作
  app.executeHook('connect') // 成功连接,发起通知
  app.executeHook('load') // 成功连接,发起通知
  // TODO  dom load, 当dom load成功后执行锚点跳转
}
