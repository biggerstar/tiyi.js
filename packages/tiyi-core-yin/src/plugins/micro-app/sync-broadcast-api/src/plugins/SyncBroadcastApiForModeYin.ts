import {NoFoundValueError, TiError, tryDoCatch} from "tiyi-core"
import {__TI_BROADCAST_} from "../../../../../mapping/constant";
import {MicroAppBuiltInPlugin} from "tiyi-core-yang";

export class SyncBroadcastApiForModeYin extends MicroAppBuiltInPlugin {
  public static priority: number = -1000   // 保证在近后面执行
  protected onConnect() {
    const self = this
    const parentWindow = this.window.top || this.window.parent
    // TODO  有bug   goto到新地址 从yin变yang，该设置还会被生效
    if (!parentWindow[__TI_BROADCAST_]) return TiError('未找到父级的broadcast实例,请保证该插件之前在主应用上挂载了broadcast')
    tryDoCatch(() => {
      Object.defineProperty(self.belongApp, 'broadcast', {
        get() {
          return NoFoundValueError('微应用broadcast功能在太乙●阴模式下不可使用!')
        },
        set: () => undefined,
        configurable: true,
        enumerable: true
      })
    })
  }
}
