import {getAppCache, getElementTypeName, getTagName, isObject} from "tiyi-core"
import {NodeProcessor} from "@/interface";
import {NodeProcessorForProcessOption} from "types";


/** 将一些不安全的节点转成安全节点(比如meta，title...等等节点使用的是top window的Element类进行构造,与期望不符) */
export class ReDefineSpecialTagProcessor extends NodeProcessor {

  public process({nodes, next}: NodeProcessorForProcessOption) {
    next(nodes.map((node) => this.reDefineSpecialTag(node)))
  }

  public reDefineSpecialTag(node) {
    const tagName = getTagName(node)
    const {window} = getAppCache(this.belongApp.id) // PLUGINS字段继承了父类必然存在
    if (['base', 'meta', 'title'].includes(tagName)) {
      const tagType = getElementTypeName(node)
      // YanElementReDefineProperty.define(node)   // 让其重定义为子应用环境的原型定义
      // 如果定义目标不是window挂载的自身类，则表明是一个Node，将原型链设置成该节点对应在环境中的对应原型，断开和原来引用联系并会才用新的被改造过安全的引用关系
      if (window && !(node === node?.prototype) && isObject(window[tagType])) {
        // @ts-ignore
        Object.setPrototypeOf(node, window[tagType]?.prototype)
      }
    }
    return node
  }
}
















