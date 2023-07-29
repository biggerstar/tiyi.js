import {MicroAppBuiltInPlugin} from "@/interface";
import {__NODE_PROCESSOR__} from "@/constant";
import {NodeProcessorForProcessOption} from "types";
import {getAppCache, isFunction, MicroApp, TiEventTargetType} from "tiyi-core";


/** 所有的处理器都需要继承该类或者将插件的type字段设置成nodeProcessor */
export class NodeProcessor extends MicroAppBuiltInPlugin {
  public priority: number = 1
  public type = __NODE_PROCESSOR__

  /**@param {Object} options
   * @param {HTMLElement} options.node   元素节点
   * @param {Function} options.handler   回调函数
   * @param {Function} options.error     错误回调函数
   * @param {Function} options.next         执行下一个处理器，洋葱模型
   *
   * */
  public process?(options: NodeProcessorForProcessOption): void;
  public onConnect?(event?: TiEventTargetType<MicroApp>): void;

  constructor() {
    super();
    const onConnect = this.onConnect
    this.onConnect = (...args: any[]) => {
      if (isFunction(onConnect)) {
        // @ts-ignore
        onConnect.apply(this, args)
      }
      const appCache = getAppCache(this.belongApp.id)
      if (!appCache[__NODE_PROCESSOR__]) appCache[__NODE_PROCESSOR__] = []
      appCache[__NODE_PROCESSOR__].push(this)
    }
  }
}
