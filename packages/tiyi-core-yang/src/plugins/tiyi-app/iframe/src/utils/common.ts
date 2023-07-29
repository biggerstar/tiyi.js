import {getAppCache, getMicroApp, MicroApp, setAppCache, sleep, StartAppError} from "tiyi-core";
import {__ABOUT_BLANK__} from "@/constant";
import {toNoHashUrlPath} from "@/utils/common";

/** 将iframe环境重置 mode = 'blank' 则加载浏览器空白页about:blank， mode = "origin" 则加载主应用的origin地址，区别是加载后location对象的不同 */
export async function resetIframeSandboxEnv(appName, mode: 'blank' | 'origin' = 'blank'): Promise<unknown> {
  const {iframe, window: appWindow} = getAppCache(appName)
  const app = <MicroApp>getMicroApp(appName)
  const updateCache = () => {
    /* 更新当前的dom */
    if (iframe) setAppCache(app.id, {document: iframe?.contentWindow?.document})
  }
  return new Promise((resolve: Function) => {
    if (mode === 'origin') {
      const isFirstLoad = iframe.src === __ABOUT_BLANK__ || !iframe.src
      const urls = new URL(app.url)
      urls.host = location.host
      if (isFirstLoad) {
        // console.log(app.url, urls.href, location.host);
        iframe.src = toNoHashUrlPath(location.href)
      } else {
        appWindow.location.reload()
      }

      stopLoading(appWindow).then(() => {
        initIframeDom(appWindow)
        console.log('first replaceState', urls.href);
        appWindow.history.replaceState(null, '', urls.href)
        updateCache()
        resolve()
      })
    } else {
      //  blank模式 有个缺点，es6 module中使用import加载的代码获取location获取不到正确的location对象，
      //  后面通过workerService优化支持es6加载，可使得该模式的iframe加载更快更完美
      // console.log('reset', __ABOUT_BLANK__)
      // appWindow.location.reload()
      iframe.src = __ABOUT_BLANK__
      iframe.onload = () => {
        setAppCache(appName, {document: appWindow.document})
        updateCache()
        resolve()
      }

    }
  })
}

//----------------------------------------------------------------
/** 初始化空document的dom结构 */
function initIframeDom(iframeWindow: Window) {
  const doc = iframeWindow.document
  const blankDoc = doc.implementation.createHTMLDocument("")
  doc.documentElement ? doc.replaceChild(blankDoc.documentElement, doc.documentElement) : doc.appendChild(blankDoc.documentElement);
}

/** [只在origin模式下生效] 停止对iframe的加载.microSleep越大则主应用内容污染子应用的概率越小，但是相应的初始化时间也会长点(在设置成20时测试基本不会加载到主页面内容)，时间差不多在25ms左右 */
async function stopLoading(iframeWindow: Window, pure: boolean = false) {
  // console.time('loadTime')
  let cont = 0
  const oldDoc = iframeWindow.document
  while (++cont) {
    const newDoc = iframeWindow.document
    await sleep(0)
    if (newDoc && oldDoc !== newDoc) {
      iframeWindow.stop ? iframeWindow.stop() : iframeWindow.document['execCommand']("Stop");
      //  这里初始化后的document大概率是空的文档(不包含head，body)，也有极小概率可能包含主页面部分html结构，在initIframeDom再次进行处理
      break
    }
    if (cont > 1e4) {
      // 防御性编程防止死循环,默认不超1w次检查，正常几十次就成功,重新加载的时候已经是fetch到html，不会存在网络延迟因素
      StartAppError('初始化iframe未成功', iframeWindow)
      break
    }
  }
  // console.timeEnd('loadTime')
}


