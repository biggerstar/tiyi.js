import {isObject, MicroAppBuiltInPlugin, TIYI} from "tiyi"

/** 每次重新链接微应用window的时候，将共享资源重新挂载到微应用中 */
export class ReProvide extends MicroAppBuiltInPlugin {
  onConnect() {
    const {share} = TIYI
    if (!share) return
    const config = this.belongApp.config
    if (!isObject(config)) return
    const {provide} = config
    share.provides(provide, this.window)
  }
}
