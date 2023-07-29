import {getAppCache} from "tiyi-core"
import {MicroAppPropertyPlugin} from "@/interface";

export class YangHTMLScriptElementReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect() {
    const self = this
    const {HTMLScriptElement: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      src: {
        get() {
          // TODO src set proxy in script queue
          return this['__TI_SRC__'] || RP.getter_src.call(this)
        },
        set(v: string) {
          this['__TI_SRC__'] = v
          if (this['isConnected']) self.belongApp.executeHook('nodeScheduler', {nodes:this})
        }
      }
    })
    //--------------------------------------------------------
    this.definePrototype(this.window['HTMLScriptElement'])
  }
}
