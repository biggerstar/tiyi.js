import {getAppCache} from "tiyi-core"
import {MicroAppPropertyPlugin} from "@/interface";

export class YangNodeReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect() {
    const self = this
    const {Node: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      appendChild: {
        value: function (node) {
          // console.log(node);
          const handler = (nodes) => RP.rowAppendChild.call(this, nodes[0])
          self.belongApp.executeHook('nodeScheduler', {nodes:node, handler})
        }
      },
      insertBefore: {
        value: function (node, refNode) {
          const handler = (nodes) => RP.rowInsertBefore.call(this, nodes[0], refNode)
          self.belongApp.executeHook('nodeScheduler', {nodes:node, handler})
        }
      },
      replaceChild: {
        value: function (node, oldNode) {
          const handler = (nodes) => RP.rowReplaceChild.call(this, nodes[0], oldNode)
          self.belongApp.executeHook('nodeScheduler', {nodes:node, handler})
        }
      }
    })
    //--------------------------------------------------------
    this.definePrototype(this.window['Node'])
  }
}










