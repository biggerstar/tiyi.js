import {getAppCache} from 'tiyi-core'
import {MicroAppPropertyPlugin} from "@/interface";
export class YangHashChangeEventReDefineProperty extends MicroAppPropertyPlugin {
  /** 将子应用中的域about:blank带hash的hash提取出来并转成当前环境域下合适的url */
  public toLocalHash4EnvHref(url: string) {
    const originalUrlInfo = new URL(url)
    const newUrlInfo = new URL(this.belongApp.location.href)
    newUrlInfo.hash = originalUrlInfo.hash
    return newUrlInfo.href
  }

  public onConnect() {
    const self = this
    const {HashChangeEvent: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      oldURL: {
        get() {
          return self.toLocalHash4EnvHref(RP['getter_oldURL'].call(this))
        }
      },
      newURL: {
        get() {
          return self.toLocalHash4EnvHref(RP['getter_newURL'].call(this))
        }
      },
    })
    //--------------------------------------------------------

    this.definePrototype(this.window['HashChangeEvent'])
  }
}
