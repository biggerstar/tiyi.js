import {getAppCache, getElementTypeName, isArray} from 'tiyi-core'
import {MicroAppPropertyPlugin} from "tiyi-core-yang";

export class YinEventReDefineProperty extends MicroAppPropertyPlugin {
  protected onConnect() {
    const self = this
    const {Event: RP} = getAppCache(this.belongApp.id, 'RPS')

    function filterTarget(target) {
      if (!target) return target
      const tagName = getElementTypeName(target)
      if (tagName === 'Window') return self.belongApp.proxyWindow
      else if (tagName === 'HTMLDocument') return self.belongApp.proxyWindow
      else return target
    }

    const composedPath = function () {
      /* 部分不支持path或者composedPath的浏览器经过修改后也能支持 */
      if (isArray(this['__PATH__'])) return this['__PATH__']   // 如果已经有了直接返回，因为二次获取会是空数组
      let path = []
      if (RP['getter_path']) path = RP['getter_path'].call(this)
      else if (RP.getter_composedPath) path = RP.getter_composedPath.call(this)
      path = path.map(filterTarget)
      this['__PATH__'] = path   // 记录下来
      return path
    }

    this.addRules({
      path: {
        get: composedPath
      },
      composedPath: {
        value: composedPath
      },
      srcElement: {
        get() {
          if (!RP['getter_srcElement']) return null
          const srcElement = RP['getter_srcElement'].call(this)
          return filterTarget(srcElement)
        }
      },
      currentTarget: {
        get() {
          if (!RP['getter_currentTarget']) return null
          const currentTarget = RP['getter_currentTarget'].call(this)
          if (!currentTarget) return currentTarget
          return filterTarget(currentTarget)

        }
      },
      target: {
        get() {
          if (!RP['getter_target']) return null
          const target = RP['getter_target'].call(this)
          return filterTarget(target)
        }
      },
    })
    this.definePrototype(this.window['Event'])

  }
}
