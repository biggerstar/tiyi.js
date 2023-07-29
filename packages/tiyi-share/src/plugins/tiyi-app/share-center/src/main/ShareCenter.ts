import {ShareManager} from "./ShareManager";
import {CssShareManager} from "../css/CssShareManager";
import {DataShareManager} from "../data/DataShareManager";
import {JsShareManager} from "../js/JsShareManager";
import {ProvideOptions, ShareCenterInterface, ShareInterface, ShareSetupOptions} from "../../../../../types/tiyi-share";


export class ShareCenter implements ShareInterface, ShareCenterInterface {
  public css: CssShareManager;
  public data: DataShareManager;
  public js: JsShareManager;

  public get register() {
    return (name: string, TargetManager): void => {
      this[name] = new TargetManager()

    }
  }

  public get load() {
    return (shareConfig: ShareSetupOptions) => {
      for (const k in this) {
        const manager = this[k]
        if (manager instanceof ShareManager) {
          if (typeof shareConfig !== 'object') continue
          //@ts-ignore
          const config = shareConfig[k]
          if (config) manager.addAll(config)
        }
      }
    }
  }

  public get provides() {
    return (provideConfig: boolean | ProvideOptions, targetWindow: WindowProxy) => {
      for (const k in this) {
        const manager = this[k]
        if (manager instanceof ShareManager) {
          let config
          if (provideConfig === true) config = true
          else if (provideConfig && typeof provideConfig === 'object') {
            //@ts-ignore
            config = provideConfig[k]
          }
          if (config === true || Array.isArray(config)) {
            //@ts-ignore
            manager.provide(config, targetWindow)
          }
        }
      }
    }
  }
}
