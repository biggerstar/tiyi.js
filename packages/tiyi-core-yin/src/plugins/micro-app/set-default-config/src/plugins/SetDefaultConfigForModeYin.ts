import {MicroAppBuiltInPlugin} from "tiyi-core-yang";

/** 设置默认的微应用配置 */
export class SetDefaultConfigForModeYin extends MicroAppBuiltInPlugin {
  public static modeYinDefaultConfig = {
    mode: 'yin'
  }
  public priority = 999   // 优先级在模式yang后面，保证该模块运行后模式改成yin,太乙阳的优先级是1000

  public onConnect() {
    const app = this.belongApp
    const config = SetDefaultConfigForModeYin.modeYinDefaultConfig
    for (let k in config) {
      if (k === 'mode' && app[k] === 'yang') {
        app[k] = config[k]
        continue
      }
      if (!app.hasOwnProperty(k)) app[k] = config[k]  // 没被定义则使用默认配置填充
    }
  }
}
