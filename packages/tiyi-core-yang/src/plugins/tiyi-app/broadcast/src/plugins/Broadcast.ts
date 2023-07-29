import {EventBus, TiYiApp} from 'tiyi-core'
import {__TI_BROADCAST__} from "@/constant";

/** 用于主应用创建一个广播 */
export class Broadcast extends EventBus implements EventBus {
  public install(tiyiApp: TiYiApp) {
    window[__TI_BROADCAST__] = tiyiApp.broadcast = this
  }
}
