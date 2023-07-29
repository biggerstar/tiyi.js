import {isClass, isFunction} from "tiyi-core"
import {MicroAppBuiltInPlugin} from "tiyi-core-yang";

export class MicroAppDocumentProxy extends MicroAppBuiltInPlugin {
  public priority = 1000

  public onConnect() {
    this.belongApp.proxyDocument = <Document>this.createProxyDocument()
  }

  /**  创建document代理 */
  public createProxyDocument() {
    const document = this.window.document
    return new Proxy(<object>document  /* 原来的eval */, {
      get: (w: WindowProxy, k: string) => {
        let v = w[k]
        if (k === 'location') return this.belongApp.location
        return isFunction(v) && !isClass(v) ? v.bind(w) : v
      },
      set: (target, k: string | symbol, newValue: any): boolean => {
        if (k === 'location') {   // 处理 window.location = url 的情况,但是有一种情况目前没实现 location = url
          if (newValue.trim() === '') newValue = '/'
          this.belongApp.location.setHref(newValue, {isReload: true})
          return true
        }
        target[k] = newValue
        return true
      }
    })
  }
}



