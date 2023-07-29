import {getAppCache, isFunction} from "tiyi-core"
import {MicroAppPropertyPlugin} from "@/interface";

export class YangDocumentFragmentReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect(a) {
    const self = this
    const {DocumentFragment: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      append: {
        value: function (nodes) {
          if (!isFunction(RP.rowAppend)) return
          const handler = (nodes) => RP.rowAppend.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
      prepend: {
        value: function (nodes) {
          if (!isFunction(RP.rowPrepend)) return
          const handler = (nodes) => RP.rowPrepend.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
    })
    //--------------------------------------------------------
    this.definePrototype(this.window['DocumentFragment'])
  }
}
