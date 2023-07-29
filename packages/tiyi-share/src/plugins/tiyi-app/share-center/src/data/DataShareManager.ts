import {isArray} from "tiyi"
import {ShareManager} from "../main/ShareManager";

export class DataShareManager extends ShareManager {
  public add(name: string, set: string | Element): void {
    this.config[name] = set
    this.cache[name] = set
  }

  /**
   *  如果外部provide.js未设置，将会在主应用环境中加载并挂载所有的产出物
   *  */
  public provide(dataList: [] | boolean, targetWindow: WindowProxy) {
    if (dataList === true) dataList = <[]>Object.keys(this.config)  /* 外部未定义，获取当前所有资源名称 */
    else if (!isArray(dataList)) return   /* 设置成false则不会提供资源  */
    dataList.forEach(name => { /* 将数据挂载到目标window */
      targetWindow[name] = this.getCache(name)
    })
  }
}
