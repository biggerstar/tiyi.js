import {
  createElementTag,
  fetchText,
  genHookScriptContent,
  isArray,
  isFunction,
  isObject,
  isString,
  LoaderJavascriptCacheError,
  ShareJsConfigError,
  ShareUrlTypeError
} from "tiyi"
import {ShareManager} from "../main/ShareManager";


export class JsShareManager extends ShareManager {
  public add(name: string, set: string | Element): void {
    this.config[name] = set
    this.loadJs(name).then()
  }

  /** 在沙箱中获取拦截js执行后挂到window上的资源并保存下来;
   *  如果外部provide.js未设置，将会在主应用环境中加载并挂载所有的产出物  */
  public provide(jsList: [] | boolean, targetWindow: WindowProxy) {
    if (jsList === true) jsList = <[]>Object.keys(this.config)  /* 外部未定义，获取当前所有资源名称 */
    else if (!isArray(jsList)) return   /* 设置成false则不会提供资源  */
    jsList.forEach(async (name) => {
      const jsCache = await this.getCacheSync(name)
      const scoped = jsCache.scoped
      if (!isObject(scoped)) return
      /* 后续挂载: 后面该js域内运行更新挂到window上的数据同步更新到所有的watch iframe上，而iframe内部js只会影响自身环境的window，不会操作到scoped环境 */
      jsCache.addWatch((target, p, newValue) => targetWindow[p] = newValue)
      for (const k in scoped) {   // 已有挂载:将原有的数据同步到iframe
        targetWindow[k] = scoped[k]
      }
    })
  }

  /** 创建一个只在主环境中运行的沙箱，只隔离set操作，get操作还是会获取到主环境中的数据 */
  public createJsWindowScopedSandbox() {
    const scopedWindow = {}  /* 此处是该代码块挂载到window上的数据，实时更新 */
    const watchList = []
    const fakeWindow = new Proxy(scopedWindow, {
      get: (target, k) => target.hasOwnProperty(k) ? target[k] : (isFunction(window[k]) ? window[k].bind(window) : window[k]),
      set: (target: {}, k: string | symbol, newValue: any, receiver: any): boolean => {
        /* 里面对window原有的比如on系列事件或者其他字段的修改只会被保存下来不会附加到真实win上 */
        target[k] = newValue
        watchList.forEach(watch => watch(target, k, newValue, receiver))
        return true
      }
    })
    return {
      proxyWindow: fakeWindow,   // scoped proxy window
      scoped: scopedWindow,
      /** 通过监听baseApp的js执行域中对window的改变信息并做出相应操作，执行域里面操作会影响所有iframe，且只能被执行域内影响； 和vue的watcher思想部分类似 */
      addWatch: (watch) => isFunction(watch) && watchList.push(watch),
      removeWatch: (watch) => {
        for (let i = 0; i < watchList.length; i++) {  /* 用for是可能被添加了多个一样的watch */
          if (watchList[i] === watch) {
            watchList.splice(i, 1)
            i--
          }
        }
      }
    }
  }

  public async genScriptExportText(name, url, {type, export: exportList = []}) {
    if (!url || !isString(url)) return ShareUrlTypeError(name, url)
    let scriptText = await fetchText(url)
    if (!scriptText) return null  /* 此时获取文本失败，正常是status为非200 */
    exportList.forEach(n /* exportName */ => { /* 尝试从运行环境中导出需要的最外层变量到proxy上  */
      scriptText = scriptText + ` try { window["${n}"] = ${n} }catch (e) {window["${n}"] = undefined };`
    })
    scriptText = <string>genHookScriptContent(scriptText, {
      window: `tiyi.getJsCache('${name}','proxyWindow')`
    }, false).auto(type)
    return scriptText
  }

  public renderScript(scriptText, type) {
    createElementTag('script').attr('innerHTML', scriptText).attr('type', type, isString).appendTo(document.head)
  }

  /** 加载js到缓存并获取该js执行快里面挂载到window上的数据 */
  public async loadJs(name) {
    if (this.cache[name]) return
    let config = {}
    const item = this.get(name)
    if (isObject(item)) config = item
    else if (isString(item)) config = {url: item}
    else return ShareJsConfigError(name)
    let isSuccess = false
    this.cache[name] = this.createJsWindowScopedSandbox()
    const shareUrlList = isArray(config['url']) ? config['url'] : [config['url']]   //  参数归一化
    for (const k in shareUrlList) {
      // @ts-ignore
      const scriptText = await this.genScriptExportText(name, shareUrlList[k], config)
      if (scriptText) {
        this.renderScript(scriptText, config['type'] /* module | text/javascript | ... */)
        isSuccess = true
        break
      }
    }
    if (!isSuccess) {
      delete this.cache [name]
      LoaderJavascriptCacheError(name)
    }
  }
}
