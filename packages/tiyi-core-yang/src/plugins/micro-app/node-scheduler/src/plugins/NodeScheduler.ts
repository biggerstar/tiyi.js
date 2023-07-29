import {getAppCache, isArray, isFunction, isString, MicroApp, NoFoundValueError, TiEventTargetType} from "tiyi-core"
import {MicroAppBuiltInPlugin, NodeProcessor} from "@/interface";
import {__NODE_PROCESSOR__} from "@/constant";
import {NodeProcessorForProcessOption} from "types";


/** 节点调度器，支持添加各个节点处理器针对新添加节点进行加工处理 */
export class NodeScheduler extends MicroAppBuiltInPlugin {
  public priority: number = 5

  public getAllProcessor() {
    const processors = getAppCache(this.belongApp.id)[__NODE_PROCESSOR__]
    return processors || []
  }

  public onDestroyed() {
    const appCache = getAppCache(this.belongApp.id)
    delete appCache[__NODE_PROCESSOR__]
  }

  public onNodeScheduler(event?: TiEventTargetType<MicroApp, NodeProcessorForProcessOption>) {  // feat: add error callback
    //@ts-ignore
    let {data: {nodes, handler, error}} = event
    let point = 0
    if (!isFunction(handler)) return NoFoundValueError('nodeScheduler必须传入handler手动处理节点插入逻辑函数', nodes)
    if (!isArray(nodes)) nodes = [nodes]
    const processors = this.getAllProcessor()   //  如果在添加node之后再添加的处理器，该任务不会调用到新添加的处理器
    // console.log(nodes);
    const next = (rowNodes: Array<Element>) => {
      if (!isArray(rowNodes)) return NoFoundValueError('next函数应该传入一个交给下个处理器的节点数组')
      // 重新过滤，可支持在处理器内部nodes[i] = null或者 delete nodes[i]等操作,插入节点时节点可能是纯文本或HTMLElement，过滤不能把文本节点过滤掉
      rowNodes = rowNodes.filter((node) => isString(node) || Boolean(node))
      if (rowNodes.length === 0) return  //  如果数组在前面已经被处理器拦截拿完或者去除了，后面已经没节点可以处理则直接退出也无需执行handler
      if (processors.length > point) {
        const processor = processors[point++] as NodeProcessor
        // 将节点数组和对应参数分配到处理器
        processor?.process?.({
          nodes: rowNodes,
          handler,
          error,
          next
        })
      } else {
        // 所有处理器都走完后走这里，如果所有被某个处理器拦截了，处理器内部就不要执行next函数，或者拦截部分节点处理器内部直接将该对应节点删除再通过next函数将数组交出去
        handler(rowNodes)
      }
    }
    next(nodes)
  }
}
