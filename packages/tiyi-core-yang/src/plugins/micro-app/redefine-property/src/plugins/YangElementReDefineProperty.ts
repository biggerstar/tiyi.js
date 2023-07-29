import {getAppCache, isFunction} from "tiyi-core"
import {MicroAppPropertyPlugin} from "@/interface";

export class YangElementReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect() {
    // 使用Sanitizer能去除script标签
    const self = this
    const {Element: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      /* 另有 insertAdjacentHTML 和 insertAdjacentText 插入包含script标签等脚本不会被执行，所以不用管 */
      insertAdjacentElement: {
        value: function (type, node) {
          if (!isFunction(RP.rowInsertAdjacentElement)) return
          const handler = (nodes) => RP.rowInsertAdjacentElement.call(this, type, nodes[0])
          self.belongApp.executeHook('nodeScheduler', {nodes:node, handler})
        }
      },
      /* 同样的有prepend，before,after */
      append: {
        value: function (...nodes) {
          if (!isFunction(RP.rowAppend)) return
          const handler = (nodes) => RP.rowAppend.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
      prepend: {
        value: function (...nodes) {
          if (!isFunction(RP.rowPrepend)) return
          const handler = (nodes) => RP.rowPrepend.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
      before: {
        value: function (...nodes) {
          if (!isFunction(RP.rowBefore)) return
          const handler = (nodes) => RP.rowBefore.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
      after: {
        value: function (...nodes) {
          if (!isFunction(RP.rowAfter)) return
          const handler = (nodes) => RP.rowAfter.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
      replaceChildren: {
        value: function (...nodes) {
          if (!isFunction(RP.rowReplaceChildren)) return
          const handler = (nodes) => RP.rowReplaceChildren.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
      replaceWith: {
        value: function (...nodes) {
          if (!isFunction(RP.rowReplaceWith)) return
          const handler = (nodes) => RP.rowReplaceWith.apply(this, nodes)
          self.belongApp.executeHook('nodeScheduler', {nodes, handler})
        }
      },
    })
    //--------------------------------------------------------
    this.definePrototype(this.window['Element'])
  }
}





