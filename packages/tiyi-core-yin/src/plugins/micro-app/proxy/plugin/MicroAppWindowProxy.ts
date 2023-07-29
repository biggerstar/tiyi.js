import {isClass, isFunction} from "tiyi-core"
import {MicroAppBuiltInPlugin} from "tiyi-core-yang";

export class MicroAppWindowProxy extends MicroAppBuiltInPlugin {
  public priority = 1000
  public belongApp
  public window: WindowProxy    /* 子应用的window */

  public onConnect() {
    this.belongApp.proxyWindow = this.createProxyWindow()
  }

  public createProxyWindow() {
    return new Proxy(this.window  /* 原来的eval */, {
      get: (w: WindowProxy, k: string, receiver: any) => {
        // 这里只代理window默认不能重定义的字段，可以重定义的字段由windowRule定义
        let v = w[k]
        if (k === 'top' || k === 'window') return receiver   /* 隔离获取顶级window */
        if (k === 'document') return this.belongApp.proxyDocument  /* 返回代理的document */
        if (k === 'location') return this.belongApp.location /* 返回代理的location */
        return isFunction(v) && !isClass(v) ? v.bind(w) : v
      },
      set: (target, k: string | symbol, newValue: any): boolean => {
        if (k === 'location') {   // 处理 window.location = url 的情况,但是有一种情况目前没实现 location = url
          if (newValue.trim() === '') newValue = '/'
          this.belongApp.location.setHref(newValue, {isReload: true})
          return true
        }
        //  TODO  add a event hook proxy set
        target[k] = newValue
        return true
      }
    })
  }
}








