import {MicroAppBuiltInPlugin} from "@/interface";

/** 设置默认的微应用配置 */
export class SetDefaultConfigForModeYang extends MicroAppBuiltInPlugin {
  public static modeYanDefaultConfig = {
    mode: 'yang'
  }
  public priority = 1000   // 优先级在前面，后面的插件能修改配置，也可以拦截插件修改该类默认配置

  public onConnect() {
    const config = SetDefaultConfigForModeYang.modeYanDefaultConfig
    for (let k in config) {
      if (!this.belongApp.hasOwnProperty(k)) this.belongApp[k] = config[k]  // 没被定义则使用默认配置填充
    }
  }
}

